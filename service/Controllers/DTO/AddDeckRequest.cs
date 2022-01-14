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


namespace Spacecowboy.Service.Controllers.DTO
{
    /// <summary>
    /// Add a deck of cards to a session
    /// </summary>
    public class AddDeckRequest
    {
        /// <summary>
        /// Cards in this deck
        /// </summary>
        public CreateCardRequest[] Cards { get; set; }

        /// <summary>
        /// A card used when no vote has been cast
        /// </summary>
        public CreateCardRequest NoVote { get; set; }

        /// <summary>
        /// A card representing a vote that has not yet been revealed
        /// </summary>
        public CreateCardRequest NotRevealed { get; set; }

        /// <summary>
        /// The name of the deck
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// The type of deck
        /// </summary>
        public string Type { get; set; }
    }
}
