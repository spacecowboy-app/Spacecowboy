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


/** Encapsulates an error while communicating with the service. */
export default class ServiceException {

    /** HTTP status code for the error.  Status code 0 represents an error in the application. */
    public status: number;

    /** Descriptive error message. */
    public statusText: string;


    /**
     * Create a service error object
     * @param status HTTP status code for the error, or 0 for application internal error
     * @param statusText Descriptive error message
     */
    public constructor(status: number, statusText: string)
    {
        this.status = status;
        this.statusText = statusText;
    }
}
