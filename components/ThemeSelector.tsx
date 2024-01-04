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

import { useContext, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import LightMode from "@mui/icons-material/LightMode";
import DarkMode from "@mui/icons-material/DarkMode";
import log from "loglevel";

import { ThemeVariantContext, ThemeVariantDispatchContext } from "@/model/context/ThemeVariantContext";
import { getThemeState, storeThemeState } from "@/state/PersistentThemeState";



/**
 * Component to toggle between light and dark application theme.
 */
export default function ThemeSelector(): JSX.Element
{
    const theme = useContext(ThemeVariantContext);
    const dispatch = useContext(ThemeVariantDispatchContext);

    /* If there is no theme variant set, attempt to retrieve theme variant from persistent storage. */
    useEffect(() => {
        if (!theme) {
            const persistedTheme = getThemeState();
            log.debug(`Got theme variant ${persistedTheme} from persistent storage.`);
            dispatch({ type: "set", value: persistedTheme ?? "light" });
        }
    }, [theme, dispatch]);

    return (
        <IconButton color="inherit" aria-label="theme toggle" onClick={ () => toggleTheme() } >
            { !theme || theme === "light" ? <LightMode /> : <DarkMode /> }
        </IconButton>
    );


    function toggleTheme(): void
    {
        const newTheme = ( !theme || theme === "light" ? "dark" : "light");
        storeThemeState(newTheme);
        log.debug(`Persisted theme state ${ newTheme }.`);
        dispatch({ type: "set", value: newTheme });
    }

}
