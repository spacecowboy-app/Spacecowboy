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

import { Participant, Session, SessionInformation } from "../model/apptypes";
import { Deck } from "../store/AssetsState";
import { CardRequest, ParticipantAddRequest } from "./servicedto";
import ServiceModelMapping from "./servicemodelmapping";
import Configuration from "../Config";


/**
 * Service API
 * This class encapsulates all service API calls.
 */
export default class Service {

    private static readonly APIBASE = Configuration.ApiBase;

    private static readonly headers = {
        "User-Agent": "PlanningPoker",
        "Content-Type": "application/json"
    };

    /**
     * Create a new session
     * The session is identified by a session identifier, which must be unique.
     * @param sessionId Session identifier
     * @throws {ServiceException} Error in communicating with the service
     */
    public static async CreateSession(sessionId: string): Promise<Session>
    {
        const response = await fetch(`${Service.APIBASE}/api/v0/session/${sessionId}`, {method: "PUT", headers: this.headers});
        if (response.ok) {
            return ServiceModelMapping.GetSession(await response.json());
        }
        throw new ServiceException(response.status, response.statusText);
    }


    /**
     * Return a random session identifier that is currently not in use
     * @throws {ServiceException} Error in communicating with the service
     */
    public static async GetRandomSessionId(): Promise<string>
    {
        const response = await fetch(`${Service.APIBASE}/api/v0/session/random`, {method: "GET", headers: this.headers});
        if (response.ok) {
            return response.json();
        }
        throw new ServiceException(response.status, response.statusText);
    }


    /**
     * Check whether a session identifier is in use
     * @param sessionId Session identifier
     * @throws {ServiceException} Error in communicating with the service
     */
    public static async SessionIdExists(sessionId: string): Promise<boolean>
    {
        const response = await fetch(`${Service.APIBASE}/api/v0/session/${sessionId}`, {method: "HEAD", headers: this.headers});
        return (response.status !== 404);
    }


    /**
     * Add a deck to a session
     * @async
     * @param sessionId Session identifier
     * @param deck Deck to add
     * @throws {ServiceException} Error in communicating with the service
     */
    public static async AddDeck(sessionId: string, deck: Deck): Promise<void>
    {
        const sessionCards = deck.cards.map((c) => (new CardRequest(c)));
        const sessionDeck = {cards: sessionCards, noVote: new CardRequest(deck.noVote), notRevealed: new CardRequest(deck.hiddenVote), name: deck.name, type: deck.type};
        const response = await fetch(`${Service.APIBASE}/api/v0/session/${sessionId}/deck`, {method: "PUT", headers: this.headers, body: JSON.stringify(sessionDeck)});
        if (!response.ok) {
            throw new ServiceException(response.status, response.statusText);
        }
    }


    /**
     * Add a participant to a session
     * @async
     * @param {string} sessionId Session identifier
     * @param {ParticipantAddRequest} participant Participant information
     * @returns {Participant} Participant information
     * @throws {ServiceException} Error in communicating with the service
     */
    public static async AddParticipant(sessionId: string, participant: ParticipantAddRequest): Promise<Participant>
    {
        const body = {name: participant.name, avatar: participant.avatar, color: ""};
        const response = await fetch(`${Service.APIBASE}/api/v0/session/${sessionId}/participant`, {method: "POST", headers: this.headers, body: JSON.stringify(body)});
        if (!response.ok) {
            throw new ServiceException(response.status, response.statusText);
        }
        return ServiceModelMapping.GetParticipant(await response.json());
    }


    /**
     * Remove a participant from a session
     * @async
     * @param {string} sessionId Session identifier
     * @param {string} participantId Participant identifier
     * @throws {ServiceException} Error in communicating with the service
     */
    public static async RemoveParticipant(sessionId: string, participantId: string): Promise<void>
    {
        const response = await fetch(`${Service.APIBASE}/api/v0/session/${sessionId}/participant/${participantId}`, {method: "DELETE", headers: this.headers});
        if (!response.ok) {
            throw new ServiceException(response.status, response.statusText);
        }
    }


    /**
     * Retrieve a list of active sessions
     * @returns List of sessions
     * @throws {ServiceException} Error in commnicating with the service
     */
    public static async ListSessions(): Promise<SessionInformation[]>
    {
        const response = await fetch(`${Service.APIBASE}/api/v0/session`, {method: "GET", headers: this.headers});
        if (!response.ok) {
            throw new ServiceException(response.status, response.statusText);
        }
        return response.json();
    }


    /**
     * Get information about a session
     * @param id  Session identifier
     * @param participantId ID of participant requesting the information
     * @throws {ServiceException} Error in communicating with the service
     * @returns A session object or null if the session does not exist
     */
    public static async GetSession(id: string, participantId?: string): Promise<Session|null>
    {
        const pquery = participantId ? `?participantId=${participantId}` : "";
        const response = await fetch(`${Service.APIBASE}/api/v0/session/${id}${pquery}`, {method: "GET", headers: this.headers});
        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new ServiceException(response.status, response.statusText);
        }
        return ServiceModelMapping.GetSession(await response.json());
    }


    /**
     * Cast a vote on behalf of the given participant
     * @param sessionId Session identifier
     * @param participantId Participant identifier
     * @param voteId Vote card identifier
     * @returns True if the vote was accepted
     */
    public static async CastVote(sessionId: string, participantId: string, voteId: string): Promise<boolean>
    {
        const response = await fetch(`${Service.APIBASE}/api/v0/session/${sessionId}/vote/${participantId}/${voteId}`, {method: "PUT", headers: this.headers});
        if (!response.ok) {
            if (response.status === 409) {
                return false;
            }
            throw new ServiceException(response.status, response.statusText);
        }
        return true;
    }


    /**
     * Reset votes cast
     * @param sessionId Session identifier
     */
    public static async ResetVotes(sessionId: string): Promise<void>
    {
        const response = await fetch(`${Service.APIBASE}/api/v0/session/${sessionId}/vote`, {method: "DELETE", headers: this.headers});
        if (!response.ok) {
            throw new ServiceException(response.status, response.statusText);
        }
    }

}


/**
 * Encapsulates an error while communicating with the service
 */
export class ServiceException {

    /**
     * HTTP status code for the error.  Status code 0 represents an error in the application.
     */
    public status: number;

    /**
     * Descriptive error message
     */
    public statusText: string;


    /**
     * Create a service error object
     * @param status HTTP status code for the error, or 0 for application internal error
     * @param statusText Descriptive error message
     */
    public constructor(status: number, statusText: string)
    {
        this.status = status;
        this.statusText = statusText;
    }
}


