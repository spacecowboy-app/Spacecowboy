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

using FluentAssertions;
using Spacecowboy.Service.Model.Entities;
using Xunit;


namespace Spacecowboy.Service.Test.Model
{
    public class DeckTest
    {
        [Fact]
        public void Create_ReturnsValidEntity()
        {
            var card1 = new Card("one", "oneimg", "onecolor", "onefont", "onestyle");
            var card2 = new Card("two", "twoimg", "twocolor", "twofont", "twostyle");
            var card3 = new Card("three", "threeimg", "threecolor", "threefont", "threestyle");
            var cards = new Card[] { card1, card2, card3 };
            var novote = new Card("novote", "novoteimg", "novotecolor", "novotefont", "novotestyle");
            var notrevealed = new Card("notrevealed", "notrevealedimg", "notrevealedcolor", "notrevealedfont", "notrevealedstyle");
            var deck = new Deck("deckname", "decktype", cards, novote, notrevealed);

            deck.Cards.Count.Should().Be(3);
            deck.Name.Should().Be("deckname");
            deck.Type.Should().Be("decktype");
        }
    }
}
