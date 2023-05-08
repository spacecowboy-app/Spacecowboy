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
import log from "loglevel";
import charms from "@/charms";
import decks from "@/decks";
import ServiceException from "./ServiceException";

/** Access the Spacecowboy service component. */
export default class Service
{
    private static readonly headers = {
        "User-Agent": `Spacecowboy/${Configuration.AppVersion}`,
        "Content-Type": "application/json"
    }

    /** Return a random session identifier. */
    public static async GetRandomSessionIdAsync(): Promise<string>
    {
        const response = await fetch(`${Configuration.ApiBase}/api/v0/session/random`, {method: "GET", headers: this.headers});
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
    public static async SessionIdExistsAsync(sessionId: string): Promise<boolean>
    {
        const response = await fetch(`${Configuration.ApiBase}/api/v0/session/${sessionId}`, {method: "HEAD", headers: this.headers});
        return (response.status !== 404);
    }


    /**
     * Return all available charm sets.
     * @returns An array of charm sets.
     */
    public static GetCharmsAsync(): Promise<Charmset[]>
    {
        return new Promise((resolve) => resolve(charms));
    }


    /**
     * Return all available decks.
     * @returnsAn array of decks.
     */
    public static GetDecksAsync(): Promise<Deck[]>
    {
        return new Promise((resolve) => resolve(decks));
    }
}
