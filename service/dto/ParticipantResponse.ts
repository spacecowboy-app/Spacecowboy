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

import ModelMappingException from "./ModelMappingException";
import Participant from "@/model/Participant";


/** Participant object as returned from the service REST API. */
export default class ParticipantResponse {

    /** Participant id. */
    public id?: string;

    /** Participant name. */
    public name?: string;

    /** Participant charm relative url. */
    public avatar?: string;

    /** Number of seconds this participant has been idle */
    public idle?: number;

    /** ID of card representing this participant's vote, possibly the novote or notrevealed cards. */
    public vote?: string;


    public MapToModel(): Participant {
        if (!this.id) throw new ModelMappingException("Participant id must have a value");
        if (!this.name) throw new ModelMappingException("Participant name must have a value");
        if (!this.avatar) throw new ModelMappingException("Participant avatar must have a value");
        if (!this.idle) throw new ModelMappingException("Participant idle must have a value");
        if (!this.vote) throw new ModelMappingException("Participant vote must have a value");

        const charm = { name: this.name, charm: this.avatar};
        return new Participant(this.id, charm, this.vote, this.idle);
    }
}
