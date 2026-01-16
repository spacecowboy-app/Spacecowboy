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

import Card from "./Card";
import Participant from "./Participant";


/** Session information. Some of this information is managed by the service and shared with all participants. */
export default interface Session
{
    /** Session identifier. */
    readonly id?: string;

    /** Information about all session participants. */
    readonly participants: Participant[];

    /** The deck used for this session. */
    readonly deck?: Card[];

    /** Card to show for a participant that has not yet voted. */
    readonly noVote?: Card;

    /** Card to show for a participant that has voted when voting is not completed. */
    readonly notRevealed?: Card;

    /** Set when a round of voting is completed. */
    readonly votingCompleted: boolean;

    /** Timestamp for when the session was created. */
    readonly createTime?: string;

    /** Session generation, monotonically increasing number. */
    readonly generation?: number;

    /** The participant identifier for the current user. */
    readonly participantId?: string;

    /** Set if current user is the sesison owner. */
    readonly owner?: boolean;
}


/**
 * Validate a session identifier, returning  an error description if it is invalid.
 * @param id Session identifier
 * @returns Error description (if invalid)
 * */
export function sessionIdIsValid(id: string): string|undefined
{
    if (id.length == 0)
        return "Please provide space name"

    if (id.length > 50)
        return "Name too long";

    if (!RegExp("^[a-zA-Z0-9\-]+$").test(id))
        return "Name contains invalid characters"

    const reservedIds = [ "about", "join", "start", "decks" ];
    if (reservedIds.find(e => e == id.toLowerCase()))
        return "Name is reserved";

    return undefined;
}
