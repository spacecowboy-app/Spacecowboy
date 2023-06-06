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

import { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import LightMode from "@mui/icons-material/LightMode";
import DarkMode from "@mui/icons-material/DarkMode";

import { ThemeVariantContext, ThemeVariantDispatchContext } from "@/state/ThemeVariantContext";
import { storeThemeState } from "@/state/PersistentState";


/**
 * Component to toggle between light and dark application theme.
 */
export default function ThemeSelector(): JSX.Element
{
    const theme = useContext(ThemeVariantContext);
    const dispatch = useContext(ThemeVariantDispatchContext);

    if (theme === undefined) {
        dispatch({ type: "set", value: "light" });
    }

    return (
        <IconButton color="inherit" aria-label="theme toggle" onClick={ () => toggleTheme() } >
            {theme == "light" ? <LightMode /> : <DarkMode /> }
        </IconButton>
    );


    function toggleTheme(): void
    {
        const newTheme = (theme === "light" ? "dark" : "light");
        dispatch({ type: "set", value: newTheme });
        storeThemeState(newTheme);
    }

}
