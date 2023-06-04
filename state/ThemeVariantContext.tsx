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

import { createContext, useReducer } from "react";
import log from "loglevel";


type ThemeVariant = "light"|"dark"|undefined;

export const ThemeVariantContext = createContext<ThemeVariant>(undefined);
export const ThemeVariantDispatchContext = createContext<any>(null);


interface Props
{
    children: JSX.Element[]|JSX.Element
}


export interface ThemeVariantAction
{
    type: "toggle"
}


/**
 * Context provider for the theme variant.
 */
export function ThemeVariantProvider(props: Props): JSX.Element
{
    const [ themeVariant, dispatch ] = useReducer(themeVariantReducer, undefined);

    return (
        <ThemeVariantContext.Provider value={themeVariant}>
            <ThemeVariantDispatchContext.Provider value={dispatch}>
                {props.children}
            </ThemeVariantDispatchContext.Provider>
        </ThemeVariantContext.Provider>
    );
}


/**
 * Reducer function for the theme variant context.
 */
function themeVariantReducer(themeVariant: ThemeVariant, action: ThemeVariantAction): ThemeVariant
{
    switch (action.type) {
        case "toggle":
            const newThemeVariant = themeVariant === "dark" ? "light" : "dark";
            log.debug(`Changed theme variant to ${newThemeVariant}`);
            return newThemeVariant;
        default:
            throw Error(`Unknown action ${action.type}`);
    }
}
