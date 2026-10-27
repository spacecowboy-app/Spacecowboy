/*
    Copyright 2021-2026 Rolf Michelsen and Tami Weiss

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

import { JSX, useReducer } from "react";
import { ThemeVariantContext, ThemeVariantDispatchContext, themeVariantReducer } from "./ThemeVariantContext";


interface Props
{
    children: JSX.Element[]|JSX.Element
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
