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

import log, { LogLevelDesc } from "loglevel";


export default class Configuration {

    public static readonly ApiBase: string|undefined = process.env.SPACECOWBOY_API_BASE;

    public static readonly Version: string|undefined = process.env.SPACECOWBOY_VERSION;

    public static readonly Environment: string|undefined = process.env.SPACECOWBOY_ENVIRONMENT;


    /** The application logging level */
    public static LogLevel(): LogLevelDesc
    {
        if (process.env.SPACECOWBOY_LOGLEVEL) {
            switch (process.env.SPACECOWBOY_LOGLEVEL.toUpperCase()) {
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

