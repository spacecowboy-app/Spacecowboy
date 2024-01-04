/*
    Copyright 2021-2024 Rolf Michelsen and Tami Weiss

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
using System.Collections.Generic;
using AutoMapper;
using FluentAssertions;
using Spacecowboy.Service.Infrastructure.DTO;
using Spacecowboy.Service.Model.Entities;
using Xunit;


namespace Spacecowboy.Service.Test.Repository
{
    public class RepositoryMapperTest
    {
        readonly MapperConfiguration configuration;
        readonly IMapper mapper;

        public RepositoryMapperTest()
        {
            configuration = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<RepositoryProfiles>();
            });
            mapper = configuration.CreateMapper();
        }


        [Fact]
        public void Mapper_IsValidConfiguration()
        {
            configuration.AssertConfigurationIsValid();
        }


        [Fact]
        public void ConvertSessionToDto()
        {
            var session = new Session("foo-bar");
            var p1 = new Participant("inky", "inky-avatar", "inky-color");
            var p2 = new Participant("blinky", "blinky-avatar", "blinky-color");
            session.AddParticipant(p1);
            session.AddParticipant(p2);
            var c1 = new Card("1", "image-1", "color-1", "font-1", "style-1");
            var novote = new Card("novote", "novote-image", "novote-color", "novote-font", "novote-style");
            var notrevealed = new Card("notrevealed", "notrevealed-image", "notrevealed-color", "notrevealed-font", "notrevealed-style");
            var deck = new Deck("deckname", "decktype", new Card[] { c1 }, novote, notrevealed);
            session.AddDeck(deck);
            session.AddVote(p1.Id, c1.Id);

            var sessionDto = mapper.Map<SessionDto>(session);

            sessionDto.Id.Should().Be("foo-bar");
            sessionDto.DeckName.Should().Be("deckname");
            sessionDto.DeckType.Should().Be("decktype");
            sessionDto.Participants.Should().HaveCount(2);
            sessionDto.Cards.Should().HaveCount(1);
            sessionDto.SimpleVotes.Should().HaveCount(1);
            sessionDto.CreateTime.Should().Be(session.CreateTime);
            sessionDto.UpdateTime.Should().Be(session.UpdateTime);
        }


        [Fact]
        public void ConvertDtoToSession()
        {
            var sessionDto = new SessionDto { Id = "foo-bar" };
            sessionDto.CreateTime = sessionDto.UpdateTime = DateTime.UtcNow;
            sessionDto.Generation = 1;

            var participants = new List<ParticipantDto>();
            var p1 = new ParticipantDto() { Name = "inky", Avatar = "inky-avatar", Color = "inky-color", Id = Guid.NewGuid(), LastActive = DateTime.UtcNow };
            participants.Add(p1);
            sessionDto.Participants = participants;

            var cards = new List<CardDto>();
            var c1 = new CardDto() { Id = Guid.NewGuid(), Value = "1", Color = "color-1", Image = "image-1", Font = "font-1", Style = "style-1" };
            var c2 = new CardDto() { Id = Guid.NewGuid(), Value = "2", Color = "color-2", Image = "image-2", Font = "font-2", Style = "style-2" };
            cards.Add(c1);
            cards.Add(c2);
            sessionDto.Cards = cards;

            var votes = new List<SimpleVote>();
            votes.Add(new SimpleVote(p1.Id, c1.Id));
            sessionDto.SimpleVotes = votes;

            var session = mapper.Map<Session>(sessionDto);

            session.Id.Should().Be("foo-bar");
            session.GetParticipants().Should().HaveCount(1);
            session.GetCards().Should().HaveCount(2);
            session.GetVoters().Should().HaveCount(1);
            session.CreateTime.Should().Be(sessionDto.CreateTime);
            session.UpdateTime.Should().Be(sessionDto.UpdateTime);
        }


        [Fact]
        public void ConvertDtoToParticipant()
        {
            var participantDto = new ParticipantDto() { Name = "inky", Avatar = "inky-avatar", Color = "inky-color", Id = Guid.NewGuid(), LastActive = DateTime.UtcNow };
            var participant = mapper.Map<Participant>(participantDto);
            participant.Name.Should().Be("inky");
            participant.Avatar.Should().Be("inky-avatar");
            participant.Id.Should().Be(participantDto.Id);
        }

    }
}
