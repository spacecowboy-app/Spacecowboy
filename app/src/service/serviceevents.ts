/*
    Copyright 2021 Rolf Michelsen and Tami Weiss

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

import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import log from "loglevel";
import { SessionResponse } from "./servicedto";
import { clearVotesAction, clearSessionAction, setDeckAction, setGenerationAction, setParticipantsAction, setSessionIdAction, setVotingCompleteAction, SessionActions } from "../store/SessionState";
import ServiceModelMapping from "./servicemodelmapping";
import Configuration from "../Config";



enum EventTypes {
    SessionSubscribe = "SubscribeSession",
    SessionUnsubscribe = "UnsubscribeSession",
    SessionUpdated = "SessionUpdated",
    SessionVotesCleared = "SessionVotesCleared",
    Message = "Message"
}


export default class ServiceEvents {

    private static readonly APIBASE = Configuration.ApiBase;

    private connection: HubConnection|undefined = undefined;
    private server: string|undefined = undefined;
    private sessionId: string|undefined = undefined;

    private readonly dispatch: (action: SessionActions) => void;


    public constructor(dispatch: (action: SessionActions) => void)
    {
        this.dispatch = dispatch;
    }


    /**
     * Connects to the service event hub for a given session.
     * @param sessionId Session id
     */
    public async Connect(sessionId: string): Promise<void>
    {
        this.sessionId = sessionId;
        this.server = `${ServiceEvents.APIBASE}/sessionhub`;

        this.connection = new HubConnectionBuilder()
            .withUrl(this.server)
            .withAutomaticReconnect()
            .build();

        this.connection.on(EventTypes.Message, (message: string) => {
            log.info(`Service message: ${message}`);
        });

        this.connection.on(EventTypes.SessionUpdated, (sessionresponse: SessionResponse) => {
            const session = ServiceModelMapping.GetSession(sessionresponse);
            if (session) {
                this.dispatch(setSessionIdAction(session.id));
                this.dispatch(setParticipantsAction(session.participants));
                this.dispatch(setGenerationAction(session.generation));
                this.dispatch(setVotingCompleteAction(session.votingCompleted));
                if (session.deck) {
                    this.dispatch(setDeckAction(session.deck));
                }
            }
            else {
                this.dispatch(clearSessionAction());
            }

        });

        this.connection.on(EventTypes.SessionVotesCleared, () =>
        {
            this.dispatch(clearVotesAction());
        });

        try {
            await this.connection.start();
            log.debug(`Connected to signalr service at ${this.server}`);
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
        this.server = undefined;
    }

}