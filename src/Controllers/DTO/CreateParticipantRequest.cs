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

using System.ComponentModel.DataAnnotations;


namespace Spacecowboy.Service.Controllers.DTO
{
    public record CreateParticipantRequest
    {
        /// <summary>
        /// Participant name
        /// </summary>
        /// <remarks>
        /// The service does not use this property for anything. It is intended for the client to use to store the publically
        /// displayed nick or name associated with the participant.
        /// </remarks>
        [Required]
        public required string Name { get; init; }


        /// <summary>
        /// Avatar reference
        /// </summary>
        /// <remarks>
        /// The service does not use this property for anything. It is intended for the client to use as a reference to
        /// the participant's avatar.  It is up to the client to define the format of this reference.
        /// </remarks>
        public string? Avatar { get; init;  }


        /// <summary>
        ///  Avatar color
        /// </summary>
        public string? Color { get; init; }

    }
}
