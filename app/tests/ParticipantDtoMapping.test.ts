/*
    Copyright 2021-2025 Rolf Michelsen and Tami Weiss

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

import ParticipantResponse, { asParticipant } from "../service/dto/ParticipantResponse";


describe("ParticipantResponse", () => {

    test("valid object maps correctly", () => {
        const participantResponse: ParticipantResponse = {
            id: "f72fd6d7-1647-4822-9ea1-525a91e958b0",
            name: "Clyde",
            avatar: "/clyde.png",
            idle: 0,
            vote: "foo"
        }
        const p = asParticipant(participantResponse);
        expect(p.id).toBe("f72fd6d7-1647-4822-9ea1-525a91e958b0");
        expect(p.avatar.name).toBe("Clyde");
        expect(p.avatar.charm).toBe("/clyde.png");
        expect(p.idle).toBe(0);
        expect(p.vote).toBe("foo");

    })

});