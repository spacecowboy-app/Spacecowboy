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

import { test, expect } from "@jest/globals";

import SessionResponse, { asSession } from "../service/dto/SessionResponse";


describe("SessionResponse", () => {

    // TODO Very minimalistic test
    test("valid object maps correctly", () => {
        const sessionResponse: SessionResponse = {
            id: "foo-bar",
            createTime: "2023-01-01T10:10:10",
            generation: 1,
            votingCompleted: false,
            cards: [],
            noVote: {
                id: "eaf6aac8-8772-4926-bb6e-0ff3eda499a3",
            },
            notRevealed: {
                id: "b4f4f10a-45c5-490b-b545-ebdbcb8091b5",
            },
        }
        const session = asSession(sessionResponse);
        expect(session.id).toBe("foo-bar");
        expect(session.createTime).toBe("2023-01-01T10:10:10");
        expect(session.generation).toBe(1);
        expect(session.votingCompleted).toBeFalsy();
    })

});