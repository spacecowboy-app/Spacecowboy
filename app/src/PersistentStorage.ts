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

import log from "loglevel";

/**
 * Stores some session information in semi-persistent storage in the browser.
 * The purpose of this class is to survive a page reload with the participant remaining
 * in the session.
 *
 * Set the participant state when a participant has initially joined a session.
 * Clear the participant state when the participant later leaver the session.
 */
export default class PersistentStorage {

    private static readonly storageKey = "spacecowboy";


    /**
     * Save participant state to semi-persistent storage
     * @param state Participant state
     */
    public static setParticipantState(state: ParticipantState): void
    {
        try {
            sessionStorage.setItem(this.storageKey, JSON.stringify(state));
        }
        catch {
            log.warn("Unable to save state to browser storage");
        }
    }


    /**
     * Retrieves the the participant state from semi-persistent storage
     * @returns Participant state or null
     */
    public static getParticipantState(): ParticipantState|null
    {
        try {
            const state = sessionStorage.getItem(this.storageKey);
            return state === null ? null : JSON.parse(state);
        }
        catch {
            log.warn("Unable to retrieve state from browser storage");
            return null;
        }
    }

    /**
     * Clear participant state from storage.  This is typically invoked as the participant
     * leaves the session.
     */
    public static clearParticipantState(): void
    {
        try {
            sessionStorage.removeItem(this.storageKey);
        }
        catch {
            log.warn("Unable to clear state from browser storage");
        }
    }

}




interface ParticipantState {

    /** Session identifier */
    sessionId: string;

    /** Participant identifier in this session */
    participantId: string;

    /** Participant authorization token for this session */
    participantAuthorization: string;

}