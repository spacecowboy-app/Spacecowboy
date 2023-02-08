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

import { Card } from "../store/AssetsState";


export class CardRequest {
    public readonly value?: string;
    public readonly image?: string;
    public readonly color?: string;
    public readonly font?: string;
    public readonly style?: string;

    public constructor(card: Card)
    {
        this.value = card.value;
        this.image = card.image;
        this.color = card.color;
        this.font = card.font;
        this.style = card.style;
    }
}


/**
 * Information about a session
 */
export interface SessionResponse {
    id: string;
    participants?: ParticipantResponse[];
    cards: Card[];
    noVote?: Card;
    notRevealed?: Card;
    createTime: string;
    generation: number;
    votingCompleted: boolean;
}



/**
 * Information about the participants in a session and their vote.
 * Note that vote can refer to the noVote or notRevealed cards.
 */
export interface ParticipantResponse {
    id: string;
    name: string;
    avatar: string;

    /** Number of seconds this participant has been idle */
    idle: number;

    /** ID of card representing this participant's vote */
    vote: string;
}


export interface ParticipantAddRequest {
    name: string;
    avatar: string;
}
