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

using System;
using Spacecowboy.Service.Model.Entities;


namespace Spacecowboy.Service.Controllers.DTO
{
    /// <summary>
    /// Summary information about a voting session
    /// </summary>
    public class SessionInfoResponse
    {
        /// <summary>
        /// Globally unique session identifier
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// Number of participants currently in session
        /// </summary>
        public int Participants { get; set; }

        /// <summary>
        /// Time when this session was created
        /// </summary>
        public DateTime CreateTime { get; set; }

        /// <summary>
        /// Time when the session was last updated
        /// </summary>
        public DateTime UpdateTime { get; set; }

        /// <summary>
        /// The number of seconds that this session has been idle
        /// </summary>
        public double IdleTime => (DateTime.UtcNow - UpdateTime).TotalSeconds;


        public SessionInfoResponse(Session session)
        {
            Id = session.Id;
            CreateTime = session.CreateTime;
            UpdateTime = session.UpdateTime;
            Participants = session.GetParticipantsCount();
        }
    }
}
