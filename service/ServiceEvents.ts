/*
    Copyright 2021-2023 Rolf Michelsen and Tami Weiss

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import { createContext } from "react";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import log from "loglevel";

import SessionResponse from "./dto/SessionResponse";
import Configuration from "@/Configuration";
import { SessionActions, clearSessionAction, clearVotesAction, setSessionAction } from "@/model/context/SessionContext";


enum EventTypes {
    SessionSubscribe = "SubscribeSession",
    SessionUnsubscribe = "UnsubscribeSession",
    SessionUpdated = "SessionUpdated",
    SessionVotesCleared = "SessionVotesCleared",
    Message = "Message"
}



/**
 * Manages a persistent connection to the service, primarily to receive events from the service.
 * This is currently implemented as a SignalR connection.
 */
export default class ServiceEvents {

    private connection?: HubConnection = undefined;
    private server?: string = undefined;
    private sessionId?: string = undefined;

    private readonly dispatch: (action: SessionActions) => void;


    public constructor(dispatch: (action: SessionActions) => void)
    {
        this.dispatch = dispatch;
    }


    /**
     * Connects to the service event hub for a given session.
     * Disconnects if already connected to a different session.  Does nothing if already connected to
     * the given session.
     * @param sessionId Session id
     */
    public async Connect(sessionId: string): Promise<void>
    {
        if (this.IsConnected()) {
            if (sessionId == this.sessionId) {
                log.debug(`Attempting to connect to existing session [${sessionId}], doing nothing.`);
                return;
            }
            log.debug(`Attempting to connect to session [${sessionId}]; disconnecting from [${this.sessionId}].`)
            await this.Disconnect();
        }

        this.sessionId = sessionId;
        this.server = `${Configuration.ApiBase}/sessionhub`;

        this.connection = new HubConnectionBuilder()
            .withUrl(this.server)
            .withAutomaticReconnect()
            .build();

        this.connection.on(EventTypes.Message, (message: string) => {
            log.info(`Service message: ${message}`);
        });

        this.connection.on(EventTypes.SessionUpdated, (sessionresponse: SessionResponse) => {
            if (sessionresponse.id) {
                this.dispatch(setSessionAction(sessionresponse));
                log.debug(`Got an update for session ${sessionresponse.id}`);
            }
            else {
                this.dispatch(clearSessionAction());
                log.debug(`Got an update to clear the session`);
            }

        });

        this.connection.on(EventTypes.SessionVotesCleared, () =>
        {
            this.dispatch(clearVotesAction());
            log.debug("God at update to clear votes");
        });

        try {
            await this.connection.start();
            log.debug(`Connected to signalr service at ${this.server} for session [${sessionId}]`);
        }
        catch (err) {
            log.error(`Attempted to connect to ${this.server} but got error: ${err}`);
            throw err;
        }

        this.connection.invoke(EventTypes.SessionSubscribe, sessionId)
            .then(() => {
                log.debug(`Subscribed to updates for session ${sessionId}`);
            })
            .catch((err: Error) => {
                log.error(`Unable to subscribe to updates for session ${sessionId}`);
                log.error(err.toString());
            });
    }



    /**
     * Disconnects from the service event hub.
     */
    public async Disconnect(): Promise<void>
    {
        if (this.connection === undefined) {
            return;
        }

        if (this.connection.state === HubConnectionState.Connected) {
            try {
                await this.connection.invoke(EventTypes.SessionUnsubscribe, this.sessionId);
                log.debug(`Unsubscribed from updates for session ${this.sessionId}`);
            }
            catch (err) {
                log.error(`Unable to unsubscribe from updates for session ${this.sessionId}`);
                // Logger.Error(err.toString());   // TODO: Fix tis
            }
        }

        this.connection.off(EventTypes.SessionUpdated);
        this.connection.off(EventTypes.SessionVotesCleared);
        this.connection.off(EventTypes.Message);
        this.connection.stop();

        log.debug(`Disconnected from signalr service at ${this.server}`);

        this.connection = undefined;
        this.sessionId = undefined;
        this.server = undefined;
    }


    /** Returns true if currently connected. */
    public IsConnected = () => (this.connection?.state === HubConnectionState.Connected);


    /** Returns the session id for a connection, or undefined if not connected. */
    public ConnectedId = () => (this.IsConnected() ? this.sessionId : undefined);

}


export const ServiceEventsContext = createContext<ServiceEvents|undefined>(undefined);
