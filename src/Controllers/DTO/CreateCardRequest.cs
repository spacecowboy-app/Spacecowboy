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


namespace Spacecowboy.Service.Controllers.DTO
{
    /// <summary>
    /// Create a card in a session
    /// </summary>
    public record CreateCardRequest
    {
        /// <summary>
        /// Card value
        /// </summary>
        public string? Value { get; init; }

        /// <summary>
        /// Reference to an image representing the card
        /// </summary>
        public string? Image { get; init; }

        /// <summary>
        /// Reference to a color for the card
        /// </summary>
        public string? Color { get; init; }

        /// <summary>
        /// Reference to a font for the card
        /// </summary>
        public string? Font { get; init; }

        /// <summary>
        /// Card style identifier
        /// </summary>
        public string? Style { get; init; }
    }
}
