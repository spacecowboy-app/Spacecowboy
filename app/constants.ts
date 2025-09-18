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

import { SnackbarOrigin } from "@mui/material/Snackbar";
import Configuration from "./Configuration";


export default class Constants
{
    /** Duration for all snackbar messages (milliseconds). */
    public static readonly SnackbarDurationMs = 6000;

    /** Duration for short snackbar messages (milliseconds). */
    public static readonly SnackbarDurationShortMs = 1000;

    /** Position for all snackbar messages. */
    public static readonly SnackbarAnchor: SnackbarOrigin = { vertical: "top", horizontal: "center" };

    /** Path to decks assets. */
    public static readonly CardsPath = `${Configuration.ApiBase}/resources/decks`;

    /** Path to charm assets. */
    public static readonly CharmsPath = `${Configuration.ApiBase}/resources/charms`;
}