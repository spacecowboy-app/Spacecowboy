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

using System;
using FluentAssertions;
using Spacecowboy.Service.Model.Entities;
using Xunit;


namespace Spacecowboy.Service.Test.Model
{
    public class SessionCardTest
    {
        // Name of sessions created by these tests
        private readonly string sessionId = "foo-bar";


        [Fact]
        public void NewSessionContainsNoCards()
        {
            Session session = new Session(sessionId);
            session.GetCards().Should().BeEmpty();
        }


        [Fact]
        public void SessionShouldContainAddedCards()
        {
            Card cardA = new Card("A", "imageA", "white", "large", null);
            Card cardB = new Card("B", "imageB", "white", "large", null);

            Session session = new Session(sessionId);
            session.AddCard(cardA);
            session.AddCard(cardB);

            session.GetCards().Count.Should().Be(2);
            session.ContainsCard(cardA.Id).Should().BeTrue();
            session.ContainsCard(cardB.Id).Should().BeTrue();
        }


        [Fact]
        public void AddDuplicateCardShouldThrowException()
        {
            Card card = new Card("A", "imageA", "white", "large", "default");
            Session session = new Session(sessionId);
            session.AddCard(card);

            session.Invoking<Session>(s => s.AddCard(card)).Should().Throw<ArgumentException>();
        }


        [Fact]
        public void RemoveCardSholdBeOk()
        {
            Card cardA = new Card("A", "imageA", "white", "large", null);
            Card cardB = new Card("B", "imageB", "white", "large", null);

            Session session = new Session(sessionId);
            session.AddCard(cardA);
            session.AddCard(cardB);
            session.RemoveCard(cardA.Id);

            session.GetCards().Count.Should().Be(1);
            session.ContainsCard(cardA.Id).Should().BeFalse();
            session.ContainsCard(cardB.Id).Should().BeTrue();
        }
    }
}
