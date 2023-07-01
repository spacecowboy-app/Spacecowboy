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
import Session from "@/model/Session";
import { sessionStateReducer, setSessionIdAction } from "@/model/context/SessionContext";


describe("Session state actions", () => {

    test("Set session id", () => {
        const session: Session =
        {
            id: undefined,
            owner: undefined,
            participants: [],
            votingCompleted: false,
        };

        const newSession = sessionStateReducer(session, setSessionIdAction("foo"));

        expect(newSession.id).toBe("foo");
        expect(newSession.owner).toBeUndefined();
    }),

    test("Override session id", () => {
        const session: Session =
        {
            id: undefined,
            owner: undefined,
            participants: [],
            votingCompleted: false,
        };

        const newSession = sessionStateReducer(session, setSessionIdAction("bar"));

        expect(newSession.id).toBe("bar");
        expect(newSession.owner).toBeUndefined();

    })

});
