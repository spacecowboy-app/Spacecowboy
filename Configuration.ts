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

import log, { LogLevelDesc } from "loglevel";


export default class Configuration
{
    public static readonly ApiBase: string = process.env.NEXT_PUBLIC_SPACECOWBOY_API_BASE ?? "";

    public static readonly AppVersion?: string = process.env.NEXT_PUBLIC_SPACECOWBOY_VERSION;

    /** Prefix for all keys used when storing state in the browser using localStorage or sessionStorage. */
    public static readonly BrowserStorageKeyPrefix = "spacecowboy1";

    /** The application logging level */
    public static LogLevel(): LogLevelDesc
    {
        if (process.env.NEXT_PUBLIC_SPACECOWBOY_LOGLEVEL) {
            switch (process.env.NEXT_PUBLIC_SPACECOWBOY_LOGLEVEL.toUpperCase()) {
                case "ERROR":
                    return log.levels.ERROR;
                case "WARNING":
                    return log.levels.WARN;
                case "INFO":
                    return log.levels.INFO;
                case "DEBUG":
                    return log.levels.DEBUG;
                default:
                    return log.levels.SILENT;
            }
        }
        return log.levels.SILENT;
    }

}