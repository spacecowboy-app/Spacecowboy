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

namespace Spacecowboy.Service.Controllers.DTO
{
    /// <summary>
    /// Add a deck of cards to a session
    /// </summary>
    public record AddDeckRequest
    {
        /// <summary>
        /// Cards in this deck
        /// </summary>
        [Required]
        public required CreateCardRequest[] Cards { get; init; }

        /// <summary>
        /// A card used when no vote has been cast
        /// </summary>
        [Required]
        public required CreateCardRequest NoVote { get; init; }

        /// <summary>
        /// A card representing a vote that has not yet been revealed
        /// </summary>
        [Required]
        public required CreateCardRequest NotRevealed { get; init; }

        /// <summary>
        /// The name of the deck
        /// </summary>
        [Required]
        public required string Name { get; init; }

        /// <summary>
        /// The type of deck
        /// </summary>
        [Required]
        public required string Type { get; init; }
    }
}
