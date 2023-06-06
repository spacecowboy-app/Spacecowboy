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

import { ThemeVariant, ThemeVariantSetAction, ThemeVariantAction, themeVariantReducer } from "../state/ThemeVariantContext";


describe("Test theme variant dispatch actions", () => {

    test("toggle from light theme results in dark theme", () => {
        expect(themeVariantReducer("light", { type: "toggle" } )).toBe("dark");
    }),

    test("toggle from dark theme results in light theme", () => {
        expect(themeVariantReducer("dark", { type: "toggle" } )).toBe("light");
    })

    test("set light theme results in light theme", () => {
        const action: ThemeVariantSetAction = { type: "set", value: "light"};
        expect(themeVariantReducer("dark", action)).toBe("light");
    }),

    test("set dark theme results in dark theme", () => {
        const action: ThemeVariantSetAction = { type: "set", value: "dark"};
        expect(themeVariantReducer("light", action )).toBe("dark");
    })

});