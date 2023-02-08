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
using Spacecowboy.Service.Controllers.DTO;
using Spacecowboy.Service.Model;
using System.Linq;
using Xunit;


namespace Spacecowboy.Service.Test.Controller.DTO
{
    public class SessionResponseTest
    {
        private readonly Card card1 = new Card("1", "image1", "color1", "font1", "style1");
        private readonly Card card2 = new Card("2", "image2", "color2", "font2", "style2");

        private readonly Card novote = new Card("novote", "novote", "novote", "novote", "novote");
        private readonly Card notrevealed = new Card("notrevealed", "notrevealed", "notrevealed", "notrevealed", "notrevealed");

        private readonly Participant participant1 = new Participant("blinky", "ghost", "red");
        private readonly Participant participant2 = new Participant("pinky", "ghost", "pink");
        private readonly Participant participant3 = new Participant("inky", "ghost", "cyan");
        private readonly Participant participant4 = new Participant("clyde", "ghost", "orange");

        [Fact]
        public void SessionWithOnlyId()
        {
            var session = new Session("foo-bar");
            var response = new SessionResponse(session);
            response.Id.Should().Be("foo-bar");
            response.Participants.Should().BeNullOrEmpty();
            response.Cards.Should().BeNullOrEmpty();
            response.NotRevealed.Should().BeNull();
            response.NoVote.Should().BeNull();
        }


        [Fact]
        public void SessionWithCardsAndParticipantsNoVotes()
        {
            var session = new Session("foo-bar");
            session.AddCard(card1);
            session.AddCard(card2);
            session.AddParticipant(participant1);
            session.AddParticipant(participant2);
            session.NoVote = novote;
            session.NotRevealed = notrevealed;

            var response = new SessionResponse(session);
            response.Id.Should().Be("foo-bar");
            response.Cards.Should().HaveCount(2);
            response.Participants.Should().HaveCount(2);
            response.Cards.Should().HaveCount(2);
            response.Participants.Where(p => p.Vote == novote.Id).Should().HaveCount(2);
        }


        [Fact]
        public void SessionWithCardsAndParticipantsVoted()
        {
            var session = new Session("foo-bar");
            session.AddCard(card1);
            session.AddCard(card2);
            session.AddParticipant(participant1);
            session.AddParticipant(participant2);
            session.NoVote = novote;
            session.NotRevealed = notrevealed;
            session.AddVote(participant1.Id, card1.Id);
            session.AddVote(participant2.Id, card2.Id);

            var response = new SessionResponse(session);
            response.Participants.Where(p => (p.Id == participant1.Id && p.Vote == card1.Id)).Should().HaveCount(1);
            response.Participants.Where(p => (p.Id == participant2.Id && p.Vote == card2.Id)).Should().HaveCount(1);
        }


        [Fact]
        public void SessionWithCardsAndOneParticipantVoted()
        {
            var session = new Session("foo-bar");
            session.AddCard(card1);
            session.AddCard(card2);
            session.AddParticipant(participant1);
            session.AddParticipant(participant2);
            session.NoVote = novote;
            session.NotRevealed = notrevealed;
            session.AddVote(participant1.Id, card1.Id);

            var response = new SessionResponse(session);
            response.Participants.Where(p => (p.Id == participant1.Id && p.Vote == notrevealed.Id)).Should().HaveCount(1);
            response.Participants.Where(p => (p.Id == participant2.Id && p.Vote == novote.Id)).Should().HaveCount(1);
        }

    }
}
