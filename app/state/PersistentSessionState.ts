/*
    Copyright 2021-2025 Rolf Michelsen and Tami Weiss

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
import Configuration from "@/Configuration";


const storageKey = Configuration.BrowserStorageKeyPrefix + "-session";


/**
 * Information about a session to facilitate restoring the session if the app is reloaded.
 */
export interface PersistentSessionState {

    /** Session identifier. */
    sessionId: string,

    /** Participant identifier. */
    participantId?: string,

    /** This participant is the owner of the session. */
    isOwner?: boolean,

}



/**
 * Store the session state in browser persistent storage.
 * @param session Session state.
 */
export function storeSessionState(session: PersistentSessionState): void
{
    try {
        sessionStorage.setItem(storageKey, JSON.stringify(session));
    }
    catch {
        log.warn("Persistent session state: Unable to save session state to browser storage.");
    }
}



/**
 * Retrieve the session state from browser persistent storage.
 * @returns Persisted session state.
 */
export function getSessionState(): PersistentSessionState|null
{
    try {
        const state = sessionStorage.getItem(storageKey);
        return state === null ? null : JSON.parse(state);
    }
    catch {
        log.warn("Persistent session state: Unable to retrieve session state from browser storage.");
        return null;
    }
}
