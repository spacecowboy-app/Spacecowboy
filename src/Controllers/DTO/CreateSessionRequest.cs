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


using System.ComponentModel.DataAnnotations;
using Spacecowboy.Service.Model.Entities;

namespace Spacecowboy.Service.Controllers.DTO;

/// <summary>
/// Information about the session to be created
/// </summary>
public record CreateSessionRequest
{
    /// <summary>
    /// Globally unique session identifier
    /// </summary>
    [Required]
    public required string Id { get; init; }

    /// <summary>
    /// List of session participants
    /// </summary>
    public CreateParticipantRequest[]? Participants { get; init; }


    /// <summary>
    /// List of session cards
    /// </summary>
    public CreateCardRequest[]? Cards { get; init; }

    /// <summary>
    /// A card used to represent a vote that has not yet been cast
    /// </summary>
    public Card? NoVote { get; init; }

    /// <summary>
    /// A card used to represent a vote that has not yet been revealed
    /// </summary>
    public Card? NotRevealed { get; init; }

}

