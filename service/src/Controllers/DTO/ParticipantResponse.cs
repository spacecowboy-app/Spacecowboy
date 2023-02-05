/*
    Copyright 2021 Rolf Michelsen and Tami Weiss

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

using Spacecowboy.Service.Model;
using System;


namespace Spacecowboy.Service.Controllers.DTO
{
    public class ParticipantResponse
    {
        /// <summary>
        /// Globally unique participant identifier
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Participant name
        /// </summary>
        public string Name { get; set; }


        /// <summary>
        /// Participant avatar
        /// </summary>
        public string Avatar { get; set; }


        /// <summary>
        /// Participant color
        /// </summary>
        public string Color { get; set; }


        /// <summary>
        /// Participant idle time (in seconds)
        /// </summary>
        public double Idle { get; set; }


        /// <summary>
        /// ID of card representing this participant's vote
        /// </summary>
        /// <remarks>
        /// This ID will always reference a card that exists in the session.  It can be the novote or notrevealed cards.
        /// It can be <c>null</c> if cards have not been defined for the session, yet.
        /// </remarks>
        public Guid? Vote { get; set; }


        /// <summary>
        /// Create a ParticipantReponse from Participant, adding an explicit vote
        /// </summary>
        public ParticipantResponse(Participant participant, Guid? vote)
        {
            Id = participant.Id;
            Name = participant.Name;
            Avatar = participant.Avatar;
            Color = participant.Color;
            Idle = participant.Idle;
            Vote = vote;
        }
    }
}
