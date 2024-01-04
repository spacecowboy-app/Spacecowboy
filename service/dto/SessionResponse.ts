/*
    Copyright 2021-2024 Rolf Michelsen and Tami Weiss

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

import CardResponse, { asCard } from "./CardResponse";
import ParticipantResponse, { asParticipant } from "./ParticipantResponse";
import Session from "../../model/Session";


/** Session object as returned by the service REST API. */
export default interface SessionResponse {
    id: string;
    participants?: ParticipantResponse[];
    cards: CardResponse[];
    noVote: CardResponse;
    notRevealed: CardResponse;
    createTime: string;
    generation: number;
    votingCompleted: boolean;
}


export function asSession(response: SessionResponse): Session {
    return {
        id: response.id,
        createTime: response.createTime,
        generation: response.generation,
        votingCompleted: response.votingCompleted,
        participants: response.participants ? response.participants.map(p => asParticipant(p)) : [],
        deck: response.cards ? response.cards.map(c => asCard(c)) : undefined,
        noVote: response.noVote ? asCard(response.noVote) : undefined,
        notRevealed: response.notRevealed ? asCard(response.notRevealed) : undefined,
    };
}
