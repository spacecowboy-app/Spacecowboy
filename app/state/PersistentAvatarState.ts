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
import Avatar from "@/model/Avatar";

const storageKey = Configuration.BrowserStorageKeyPrefix + "-avatar";


/**
 * Store the avatar setting in persistent storage.
 * @param avatar Current avatar.
 */
export function storeAvatarState(avatar: Avatar)
{
    try {
        localStorage.setItem(storageKey, JSON.stringify(avatar));
    }
    catch {
        log.warn("Unable to save avatar to browser storage.");
    }
}



/**
 * Retrieve the avatar setting from persistent storage.
 * @returns Persisted avatar.
 */
export function getAvatarState(): Avatar|null
{
    try {
        const state = localStorage.getItem(storageKey);
        return state === null ? null : JSON.parse(state);
    }
    catch {
        log.warn("Unable to retrieve avatar state from browser storage.");
        return null;
    }
}
