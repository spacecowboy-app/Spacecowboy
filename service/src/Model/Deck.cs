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

using System.Collections.Generic;


namespace Spacecowboy.Service.Model
{
    /// <summary>
    /// Represents deck of cards
    /// </summary>
    public class Deck
    {
        private List<Card> cards;

        /// <summary>
        /// The name of the deck of cards (or null)
        /// </summary>
        public string Name { get; private set; }

        /// <summary>
        /// The type of deck of cards (or null)
        /// </summary>
        public string Type { get; private set; }

        /// <summary>
        /// The cards in this deck
        /// </summary>
        public IReadOnlyCollection<Card> Cards { get => cards.AsReadOnly(); private set => cards = new List<Card>(value); }

        /// <summary>
        /// A card used to represent a vote that has not yet been cast
        /// </summary>
        public Card NoVote { get; private set; }


        /// <summary>
        /// A card used to represent a vote that has not been revealed
        /// </summary>
        public Card NotRevealed { get; private set; }


        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="name">Deck name</param>
        /// <param name="type">Deck type</param>
        /// <param name="cards">Deck cards</param>
        /// <param name="noVote">Card representing no vote cast</param>
        /// <param name="notRevealed">Card representing a vote not revealed</param>
        public Deck(string name, string type, IEnumerable<Card> cards, Card noVote, Card notRevealed)
        {
            Name = name;
            Type = type;
            Cards = new List<Card>(cards);
            NoVote = noVote;
            NotRevealed = notRevealed;
        }
    }
}
