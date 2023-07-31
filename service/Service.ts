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

import Configuration from "@/Configuration";
import Charmset from "@/model/Charmset";
import Deck from "@/model/Deck";
import DecksCollection from "@/model/DecksCollection";
import log from "loglevel";
import charms from "@/charms";
import decks from "@/decks";
import ServiceException from "./ServiceException";
import Session from "@/model/Session";
import Avatar from "@/model/Avatar";
import Participant from "@/model/Participant";
import { asSession } from "@/service/dto/SessionResponse";
import { asCardRequest } from "@/service/dto/CardRequest";
import { asParticipant } from "./dto/ParticipantResponse";


const headers = {
    "User-Agent": `Spacecowboy/${Configuration.AppVersion}`,
    "Content-Type": "application/json"
};


/** Return a random session identifier. */
export async function getRandomSessionIdAsync(): Promise<string>
{
    const response = await fetch(`${Configuration.ApiBase}/api/v0/session/random`, {method: "GET", headers: headers});
    log.debug(`GetRandomSessionId returned ${response.status}`)
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
export async function sessionIdExistsAsync(sessionId: string): Promise<boolean>
{
    const response = await fetch(`${Configuration.ApiBase}/api/v0/session/${sessionId}`, {method: "HEAD", headers: headers});
    return (response.status !== 404);
}


/**
 * Return all available charm sets.
 * @returns An array of charm sets.
 */
export function getCharmsAsync(): Promise<Charmset[]>
{
    return new Promise((resolve) => resolve(charms));
}


/**
 * Return all available decks.
 * @returnsAn array of decks.
 */
export function getDecksAsync(): Promise<DecksCollection>
{
    return new Promise((resolve) => resolve(decks));
}


/**
 * Get information about a session
 * @param id  Session identifier
 * @param participantId ID of participant requesting the information
 * @throws {ServiceException} Error in communicating with the service
 * @returns A session object or null if the session does not exist
 */
export async function getSessionAsync(id: string, participantId?: string): Promise<Session|null>
{
    const pquery = participantId ? `?participantId=${participantId}` : "";
    const response = await fetch(`${Configuration.ApiBase}/api/v0/session/${id}${pquery}`, {method: "GET", headers: headers});
    if (!response.ok) {
        if (response.status === 404) {
            return null;
        }
        throw new ServiceException(response.status, response.statusText);
    }
    return asSession(await response.json());
}


/**
 * Create a new session
 * The session is identified by a session identifier, which must be unique.
 * @param sessionId Session identifier
 * @throws {ServiceException} Error in communicating with the service
 */
export async function createSessionAsync(sessionId: string): Promise<Session>
{
    const response = await fetch(`${Configuration.ApiBase}/api/v0/session/${sessionId}`, {method: "PUT", headers: headers});
    if (response.ok) {
        return asSession(await response.json());
    }
    throw new ServiceException(response.status, response.statusText);
}


/**
 * Add a deck to a session
 * @async
 * @param sessionId Session identifier
 * @param deck Deck to add
 * @throws {ServiceException} Error in communicating with the service
 */
export async function addDeckAsync(sessionId: string, deck: Deck): Promise<void>
{
    const sessionCards = deck.cards.map((c) => asCardRequest(c));
    const sessionDeck = {cards: sessionCards, noVote: asCardRequest(deck.noVote), notRevealed: asCardRequest(deck.hiddenVote), name: deck.name, type: deck.type};
    const response = await fetch(`${Configuration.ApiBase}/api/v0/session/${sessionId}/deck`, {method: "PUT", headers: headers, body: JSON.stringify(sessionDeck)});
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
// TODO Function name is not compliant with the general pattern
export async function AddParticipant(sessionId: string, participant: Avatar): Promise<Participant>
{
    const body = {name: participant.name, avatar: participant.charm};
    const response = await fetch(`${Configuration.ApiBase}/api/v0/session/${sessionId}/participant`, {method: "POST", headers: headers, body: JSON.stringify(body)});
    if (!response.ok) {
        throw new ServiceException(response.status, response.statusText);
    }
    return asParticipant(await response.json());
}


/**
 * Cast a vote on behalf of the given participant
 * @async
 * @param {string} sessionId Session identifier
 * @param {string} participantId Participant identifier
 * @param {string} voteId Vote card identifier
 * @returns {boolean} True if the vote was accepted, false if the vote was rejected as voting is not open.
 * @throws {ServiceException} Error in communicating with the service
 */
export async function castVoteAsync(sessionId: string, participantId: string, voteId: string): Promise<boolean>
{
    const response = await fetch(`${Configuration.ApiBase}/api/v0/session/${sessionId}/vote/${participantId}/${voteId}`, {method: "PUT", headers: headers});
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
 * @param {string} sessionId Session identifier
 * @throws {ServiceException} Error in communicating with the service
 */
export async function resetVotesAsync(sessionId: string): Promise<void>
{
    const response = await fetch(`${Configuration.ApiBase}/api/v0/session/${sessionId}/vote`, {method: "DELETE", headers: headers});
    if (!response.ok) {
        throw new ServiceException(response.status, response.statusText);
    }
}



/**
 * Remove a participant from a session
 * @async
 * @param {string} sessionId Session identifier
 * @param {string} participantId Participant identifier
 * @throws {ServiceException} Error in communicating with the service
 */
export async function removeParticipantAsync(sessionId: string, participantId: string): Promise<void>
{
    const response = await fetch(`${Configuration.ApiBase}/api/v0/session/${sessionId}/participant/${participantId}`, {method: "DELETE", headers: headers});
    if (!response.ok) {
        throw new ServiceException(response.status, response.statusText);
    }
}
