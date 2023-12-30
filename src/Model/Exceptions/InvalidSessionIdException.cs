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

using System;


namespace Spacecowboy.Service.Model.Exceptions
{
    /// <summary>
    /// Exception thrown when attempting to create a session with an invalid identifier
    /// </summary>
    public class InvalidSessionIdException : Exception
    {
        public InvalidSessionIdException(string sessionId) : base($"Session {sessionId} is invalid") { }
    }
}
