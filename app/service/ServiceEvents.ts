/*
    Copyright 2021-2026 Rolf Michelsen and Tami Weiss

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


/**
 * Events that this service expects to receive from the remote service.
 */
enum EventTypes {
    SessionSubscribe = "SubscribeSession",
    SessionUnsubscribe = "UnsubscribeSession",
    SessionUpdated = "SessionUpdated",
    SessionVotesCleared = "SessionVotesCleared",
    Message = "Message"
}


/**
 * Manages a persistent connection to the service, primarily to receive events from the remote service.
 * It updates local session state based on these events using the dispatch method provided in the
 * constructor.
 * This is currently implemented as a SignalR connection.
 */
export default class ServiceEvents {

    private connection?: HubConnection = undefined;
    private server?: string = undefined;
    private sessionId?: string = undefined;

    private readonly dispatch: (action: SessionActions) => void;


    /**
     * Constructor.
     * @param dispatch Dispatcher for updating local session state.
     */
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
                log.debug(`ServiceEvents: Attempting to connect to currently connected session [${sessionId}], doing nothing.`);
                return;
            }
            log.debug(`ServiceEvents: Attempting to connect to session [${sessionId}]; disconnecting from [${this.sessionId}].`)
            await this.Disconnect();
        }

        this.sessionId = sessionId;
        this.server = `${Configuration.ApiBase}/sessionhub`;

        this.connection = new HubConnectionBuilder()
            .withUrl(this.server)
            .withAutomaticReconnect()
            .build();

        /* Handle Message event.  Just log the message to the console. */
        this.connection.on(EventTypes.Message, (message: string) => {
            log.info(`ServiceEvents [${this.sessionId}]: Message: ${message}`);
        });

        /* Handle SessionUpdated event.  Set or clear the session state depending on the message received. */
        this.connection.on(EventTypes.SessionUpdated, (sessionresponse: SessionResponse) => {
            if (sessionresponse.id) {
                if (sessionresponse.id === this.sessionId) {
                    this.dispatch(setSessionAction(sessionresponse));
                    log.debug(`ServiceEvents [${this.sessionId}]: Session update received.`);
                }
                else {
                    log.error(`ServiceEvents [${this.sessionId}]: Session update for ${sessionresponse.id}; ignoring it.`);
                }
            }
            else {
                this.dispatch(clearSessionAction());
                log.debug(`ServiceEvents [${this.sessionId}]: Clear session received.`);
            }

        });

        /* Handle SessionVotesCleared event.  Clear voting status in local state. */
        this.connection.on(EventTypes.SessionVotesCleared, () =>
        {
            this.dispatch(clearVotesAction());
            log.debug(`ServiceEvents [${this.sessionId}]: Clear votes received.`);
        });

        try {
            await this.connection.start();
            log.debug(`ServiceEvents [${this.sessionId}]: Connected to signalr service at ${this.server}.`);
        }
        catch (err) {
            log.error(`ServiceEvents [${this.sessionId}]: Error while connecting to ${this.server}: ${err}`);
            throw err;
        }

        this.connection.invoke(EventTypes.SessionSubscribe, sessionId)
            .then(() => {
                log.debug(`ServiceEvents [${this.sessionId}]: Subscribed to updates.`);
            })
            .catch((err: Error) => {
                log.error(`ServiceEvents [${this.sessionId}]: Unable to subscribe to updates for session.`);
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
                log.debug(`SessionEvents [${this.sessionId}]: Unsubscribed from updates for session.`);
            }
            catch (err) {
                log.error(`SessionEvents [${this.sessionId}]: Unable to unsubscribe from updates for session.`);
                // Logger.Error(err.toString());   // TODO: Fix tis
            }
        }

        this.connection.off(EventTypes.SessionUpdated);
        this.connection.off(EventTypes.SessionVotesCleared);
        this.connection.off(EventTypes.Message);
        this.connection.stop();

        log.debug(`SessionEvents [${this.sessionId}]: Disconnected from signalr service at ${this.server}`);

        this.connection = undefined;
        this.sessionId = undefined;
        this.server = undefined;
    }


    /** Returns true if currently connected. */
    public IsConnected = () => (this.connection?.state === HubConnectionState.Connected);


    /** Returns the session id for a connection, or undefined if not connected. */
    public ConnectedId = () => (this.IsConnected() ? this.sessionId : undefined);

}


/** Context to access a singleton ServiceEvents instance. */
export const ServiceEventsContext = createContext<ServiceEvents|undefined>(undefined);
