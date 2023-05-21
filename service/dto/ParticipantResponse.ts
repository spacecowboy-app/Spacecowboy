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

import Participant from "../../model/Participant";


/** Participant object as returned from the service REST API. */
export default interface ParticipantResponse {

    /** Participant id. */
    id: string;

    /** Participant name. */
    name: string;

    /** Participant charm relative url. */
    avatar: string;

    /** Number of seconds this participant has been idle */
    idle: number;

    /** ID of card representing this participant's vote, possibly the novote or notrevealed cards. */
    vote: string;
}


export function MapFromParticipantResponse(response: ParticipantResponse): Participant {
    const charm = { name: response.name, charm: response.avatar};
    return new Participant(response.id, charm, response.vote, response.idle);
}
