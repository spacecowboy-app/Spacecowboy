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

import { Avatar, Participant, Session } from "../model/apptypes";
import { ParticipantResponse, SessionResponse } from "./servicedto";


/**
 * Maps between service DTOs and model entities
 */
export default class ServiceModelMapping {

    public static GetParticipant(p: ParticipantResponse): Participant
    {
        return new Participant(p.id, new Avatar(p.name, p.avatar), p.vote, p.idle);
    }


    // TODO: This does not properly initialize a deck because of missing information from the service.
    public static GetSession(s: SessionResponse): Session
    {
        const session = new Session(s.id, s.createTime, s.generation, s.votingCompleted);
        session.participants =  s.participants ? s.participants.map((p) => ServiceModelMapping.GetParticipant(p)) : [];
        session.deck = (s.noVote && s.notRevealed) ? {id: "", name: "", type: "", cards: s.cards, noVote: s.noVote, hiddenVote: s.notRevealed, decktop: {image: ""}} : undefined;
        return session;
    }

}