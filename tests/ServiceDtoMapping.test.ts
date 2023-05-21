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

import { test, expect } from "@jest/globals";

import SessionResponse, { MapFromSessionResponse } from "../service/dto/SessionResponse";


describe("SessionResponse", () => {

    test("valid object maps correctly", () => {
        const sessionResponse: SessionResponse = {
            id: "foo-bar",
            createTime: "2023-01-01T10:10:10",
            generation: 1,
            votingCompleted: false,
            cards: [],
            noVote: {},
            notRevealed: {},
        }
        const session = MapFromSessionResponse(sessionResponse);
        expect(session.id).toBe("foo-bar");
        expect(session.createTime).toBe("2023-01-01T10:10:10");
        expect(session.generation).toBe(1);
        expect(session.votingCompleted).toBeFalsy();
    })

});