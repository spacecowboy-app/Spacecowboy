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
using System.Linq;
using FluentAssertions;
using Spacecowboy.Service.Model.Entities;
using Xunit;


namespace Spacecowboy.Service.Test.Model
{
    public class VotingTest
    {
        private const string SessionName = "foo-bar";

        private Session session = new Session(SessionName);

        private readonly Participant Blinky = new Participant("Blinky", "blinky", "red");
        private readonly Participant Pinky = new Participant("Pinky", "pinky", "pink");
        private readonly Participant Inky = new Participant("Inky", "inky", "cyan");
        private readonly Participant Clyde = new Participant("Clyde", "clyde", "orange");

        private readonly Card CardOne = new Card("1", "one", "white", "large", "style");
        private readonly Card CardTwo = new Card("2", "two", "white", "large", "style");
        private readonly Card CardUnknown = new Card("?", "unknown", "white", "large", "style");
        private readonly Card CardBreak = new Card("Break", "coffee", "white", "large", "style");

        private readonly Card CardNoVote = new Card("NoVote", "", "", "", null);
        private readonly Card CardNotRevealed = new Card("NotRevealed", "", "", "", null);

        public VotingTest()
        {
            session.AddParticipant(Blinky);
            session.AddParticipant(Pinky);
            session.AddParticipant(Inky);
            session.AddParticipant(Clyde);

            session.AddCard(CardOne);
            session.AddCard(CardTwo);
            session.AddCard(CardUnknown);
            session.AddCard(CardBreak);

            session.NoVote = CardNoVote;
            session.NotRevealed = CardNotRevealed;
        }

        [Fact]
        public void GetVotesWithNoVotesCastIsEmptyResult()
        {
            session.GetVotes().Should().BeEmpty();
        }


        [Fact]
        public void GetVotesReturnsVotes()
        {
            session.AddVote(Blinky, CardOne);
            session.AddVote(Inky, CardUnknown);
            var votes = session.GetVotes().ToArray<Vote>();

            session.IsVotingComplete().Should().BeFalse();
            votes.Length.Should().Be(2);
            votes[0].Participant.Should().NotBe(votes[1].Participant);

            if (votes[0].Participant.Equals(Blinky))
            {
                votes[1].Participant.Should().Be(Inky);
                votes[0].Card.Should().Be(CardOne);
                votes[1].Card.Should().Be(CardUnknown);
            }
            else if (votes[0].Participant.Equals(Inky))
            {
                votes[1].Participant.Should().Be(Blinky);
                votes[0].Card.Should().Be(CardUnknown);
                votes[1].Card.Should().Be(CardOne);
            }
            else
            {
                throw new Exception("Ooops...");
            }
        }

        [Fact]
        public void AllVotesCastReturnsVotingComplete()
        {
            session.AddVote(Blinky, CardOne);
            session.AddVote(Pinky, CardOne);
            session.AddVote(Inky, CardUnknown);
            session.AddVote(Clyde, CardOne);
            session.IsVotingComplete().Should().BeTrue();
        }

        [Fact]
        public void RecastingVoteReturnsFirstVoteWhenAllVotesCast()
        {
            session.AddVote(Blinky, CardOne);
            session.AddVote(Pinky, CardOne);
            session.AddVote(Inky, CardUnknown);
            session.AddVote(Clyde, CardOne);
            session.AddVote(Clyde, CardUnknown);
            var vote = session.GetVote(Clyde);
            vote.Should().Be(CardOne);
        }


        [Fact]
        public void RecastingVoteReturnsLastVote()
        {
            session.AddVote(Blinky, CardOne);
            session.AddVote(Blinky, CardTwo);
            var votes = session.GetVotes().ToArray<Vote>();

            votes.Length.Should().Be(1);
            votes[0].Card.Should().Be(CardTwo);
        }


        [Fact]
        public void DoNotRevealVotes()
        {
            session.AddVote(Blinky, CardOne);
            session.AddVote(Inky, CardTwo);

            session.GetParticipantVoteCard(Blinky.Id, false).Should().Be(CardNotRevealed);
            session.GetParticipantVoteCard(Inky.Id, false).Should().Be(CardNotRevealed);
            session.GetParticipantVoteCard(Pinky.Id, false).Should().Be(CardNoVote);
            session.GetParticipantVoteCard(Clyde.Id, false).Should().Be(CardNoVote);
        }


        [Fact]
        public void RevealVotes()
        {
            session.AddVote(Inky, CardOne);
            session.AddVote(Blinky, CardTwo);

            session.GetParticipantVoteCard(Inky.Id, true).Should().Be(CardOne);
            session.GetParticipantVoteCard(Blinky.Id, true).Should().Be(CardTwo);
            session.GetParticipantVoteCard(Pinky.Id, true).Should().Be(CardNoVote);
            session.GetParticipantVoteCard(Clyde.Id, true).Should().Be(CardNoVote);
        }


        [Fact]
        public void SomeVotedDoNotRevealVotes()
        {
            session.AddVote(Inky, CardOne);
            session.AddVote(Blinky, CardTwo);

            session.GetParticipantsVotes(false).Where(v => v.Participant == Inky && v.Card == CardNotRevealed).Count().Should().Be(1);
            session.GetParticipantsVotes(false).Where(v => v.Participant == Blinky && v.Card == CardNotRevealed).Count().Should().Be(1);
            session.GetParticipantsVotes(false).Where(v => v.Participant == Pinky && v.Card == CardNoVote).Count().Should().Be(1);
            session.GetParticipantsVotes(false).Where(v => v.Participant == Clyde && v.Card == CardNoVote).Count().Should().Be(1);
        }


        [Fact]
        public void SomeVotedRevealParticipantVote()
        {
            session.AddVote(Inky, CardOne);
            session.AddVote(Blinky, CardTwo);

            var votes = session.GetParticipantsVotes(false, Blinky.Id);

            votes.Where(v => v.Participant == Blinky && v.Card == CardTwo).Count().Should().Be(1);
            votes.Where(v => v.Participant == Inky && v.Card == CardNotRevealed).Count().Should().Be(1);
            votes.Where(v => v.Participant == Pinky && v.Card == CardNoVote).Count().Should().Be(1);
            votes.Where(v => v.Participant == Clyde && v.Card == CardNoVote).Count().Should().Be(1);
        }


        [Fact]
        public void AllVotedRevealVotes()
        {
            session.AddVote(Inky, CardOne);
            session.AddVote(Blinky, CardTwo);
            session.AddVote(Pinky, CardUnknown);
            session.AddVote(Clyde, CardUnknown);

            session.GetParticipantsVotes(false).Where(v => v.Participant == Inky && v.Card == CardOne).Count().Should().Be(1);
            session.GetParticipantsVotes(false).Where(v => v.Participant == Blinky && v.Card == CardTwo).Count().Should().Be(1);
            session.GetParticipantsVotes(false).Where(v => v.Participant == Pinky && v.Card == CardUnknown).Count().Should().Be(1);
            session.GetParticipantsVotes(false).Where(v => v.Participant == Clyde && v.Card == CardUnknown).Count().Should().Be(1);
        }

    }
}
