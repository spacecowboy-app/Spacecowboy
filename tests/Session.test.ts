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

import { sessionIdIsValid } from "@/model/Session";



describe("Validate session id", () => {

    test.each([
        [ "foo-bar", true ],
        [ "Foo-Bar", true ],
        [ "f00-bar", true ],
        [ "foobar-foobar-foobar-foobar-foobar-foobar-foobar-foobar-", false ],      // too long
        [ "foo!bar", false ],   // invalid character
        [ "about", false ],     // reserved name
        [ "start", false ],     // reserved name
        [ "join", false ],      // reserved name
    ])("isValidId('%s') - %s", (input, expected) => {
        const valid = sessionIdIsValid(input) === undefined;
        expect(valid).toBe(expected);
    })

});
