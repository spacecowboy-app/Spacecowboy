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


namespace Spacecowboy.Service.Model
{
    /// <summary>
    /// Exception thrown when trying to access a participant that does not exist in the session
    /// </summary>
    public class ParticipantNotFoundException : Exception
    {
        /// <summary>
        /// Create exception to signal that a participant does not exist in session
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        /// <param name="participantId">Participant identifier</param>
        public ParticipantNotFoundException(string sessionId, Guid participantId) 
            : base($"Participant {participantId} does not exist in session {sessionId}") { }

    }
}
