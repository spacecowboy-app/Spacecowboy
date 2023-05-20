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

import Avatar from "./Avatar";


/**
 * Information about the participants in a session and their vote.
 * Note that vote can refer to the noVote or notRevealed cards.
 */
export default class Participant {
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
