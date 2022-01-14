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

import { Deck } from "../store/AssetsState";


/**
 * An avatar representing a participant in the game
 */
export class Avatar {
    name: string;
    image: string;

    public constructor(name: string, image: string)
    {
        this.name = name;
        this.image = image;
    }
}


/**
 * Contains assets for building avatars
 */
export interface AvatarSet {

    /** Name of this avatar theme */
    name: string;

    /** Charms for use in avatars */
    avatars: Avatar[];
}


/**
 * Information about the participants in a session and their vote.
 * Note that vote can refer to the noVote or notRevealed cards.
 */
export class Participant {
    public id: string;
    public avatar: Avatar;
    public vote: string;
    public idle: number;

    public constructor(id: string, avatar: Avatar, vote: string, idle: number)
    {
        this.id = id;
        this.avatar = avatar;
        this.vote = vote;
        this.idle = idle;
    }

    public IsIdle(): boolean
    {
        return false;
        // return (this.idle > 10);
    }
}




/**
 * Information about a session
 */
export class Session {
    public id: string;
    public participants: Participant[];
    public deck?: Deck;
    public createTime: string;
    public generation: number;
    public votingCompleted: boolean;

    public constructor(id: string, createTime: string, generation: number, votingCompleted: boolean)
    {
        this.id = id;
        this.participants = [];
        this.createTime = createTime;
        this.generation = generation;
        this.votingCompleted = votingCompleted;
    }
}


/**
 * Type for maintaining information about the participant using this
 * instance of the application.
 */
export class Me {
    [sessionId: string]: SessionParticipation;
}


/**
 * Information about a specific session that this user is registered as a
 * participant in.
 */
export class SessionParticipation {

    /** Session ID */
    public readonly sessionId: string;

    /** Participant ID in the session */
    public readonly participantId?: string;

    /** Session authorization key for privileged operations */
    public readonly sessionAuthorization?: string;

    public constructor(sessionId: string, participantId: string|undefined, sessionAuthorization?: string)
    {
        this.sessionId = sessionId;
        this.participantId = participantId;
        this.sessionAuthorization = sessionAuthorization;
    }
}


/**
 * Summary information about a session
 */
export interface SessionInformation {
    id: string;
    participants: number;
    createTime: string;
    updateTime: string;
    idleTime: number;
}
