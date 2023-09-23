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

import { Theme, ThemeOptions, createTheme } from "@mui/material/styles";


/** Color themes for light and dark theme variants. */
const colorThemes = {
    light: {
        primary: {
            light: "#bbbbbb",
            main:  "#000000",
            dark:  "#000000",
        },
        text: {
            primary: "#000000",
            secondary: "#6d7278",
        }
    },
    dark: {
        text: {
            primary: "#ffffff",
            secondary: "#6d7278",
        }
    },
};


/**
 * Return the custom app theme.
 * @param themeVariant Identifies the theme variant.
 */
export default function createAppTheme(themeVariant: "light"|"dark"): Theme
{
    const themedColors = themeVariant === "light" ? colorThemes.light : colorThemes.dark;
    const baseTheme: ThemeOptions = {
        typography: {
            fontFamily: [
                '"Poppins"',
                'Helvetica',
                'sans-serif'
            ].join(","),
            h1: {
                fontSize: "32px",
                fontWeight: "500",
                textTransform: "lowercase",
                color: themedColors.text.secondary,
            },
            h2: {
                fontSize: "22px",
                fontWeight: "500",
                fontVariantCaps: "all-small-caps",
                color: themedColors.text.secondary,
            },
            h3: {
                fontSize: "14px",
                fontWeight: "500",
                color: themedColors.text.secondary,
            },
            h4: {
                fontSize: "110%",
                fontWeight: "bold",
            },
            subtitle1: {
                fontSize: "80%",
            },
        },
        palette: {
            mode: themeVariant,
            ...themedColors,
        }
    };

    return createTheme(baseTheme);
}
