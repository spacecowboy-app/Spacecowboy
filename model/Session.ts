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


export default class Session {


    /** Validate a session identifier, returning  an error description if it is invalid. */
    public static IsValidId(id: string): string|undefined
    {
        if (id.length == 0)
            return "Please provide space name"

        if (id.length > 50)
            return "Name too long";

        if (!RegExp("^[a-zA-Z0-9\-]+$").test(id))
            return "Name contains invalid characters"
        
        const reservedIds = [ "about", "join", "start" ];
        if (reservedIds.find(e => e == id.toLowerCase()))
            return "Name is reserved";

        return undefined;
    }

}