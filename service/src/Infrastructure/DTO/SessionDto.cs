/*
    Copyright 2021-2026 Rolf Michelsen and Tami Weiss

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
using System.Linq;

using Spacecowboy.Service.Model.Entities;

namespace Spacecowboy.Service.Infrastructure.DTO;

/// <summary>
/// Represents a session as stored in a repository
/// </summary>
public class SessionDto
{
    public required string Id { get; set; }
    public DateTime CreateTime { get; set; }
    public DateTime UpdateTime { get; set; }
    public int Generation { get; set; }
    public int ParticipantCountMax { get; set; }
    public int VoteCount { get; set; }
    public IEnumerable<ParticipantDto>? Participants { get; set; }
    public IEnumerable<CardDto>? Cards { get; set; }
    public IEnumerable<SimpleVote>? SimpleVotes { get; set; }
    public CardDto? NoVote { get; set; }
    public CardDto? NotRevealed { get; set; }
    public string? DeckName { get; set; }
    public string? DeckType { get; set; }


    /// <summary>
    /// Explicit cast from model <see cref="Session"/> to <see cref="SessionDto"/>.
    /// </summary>
    public static explicit operator SessionDto(Session session)
    {
        return new SessionDto
        {
            Id = session.Id,
            CreateTime = session.CreateTime,
            UpdateTime = session.UpdateTime,
            Generation = session.Generation,
            ParticipantCountMax = session.ParticipantCountMax,
            VoteCount = session.VoteCount,
            Participants = session.Participants is not null ? session.Participants.Select(p => (ParticipantDto) p).ToList() : null,
            Cards = session.Cards is not null ? session.Cards.Select(c => (CardDto) c).ToList() : null,
            SimpleVotes = session.SimpleVotes is not null ? session.SimpleVotes.ToList() : null,
            NoVote = session.NoVote is not null ? (CardDto)session.NoVote : null,
            NotRevealed = session.NotRevealed is not null ? (CardDto) session.NotRevealed : null,
            DeckName = session.DeckName,
            DeckType = session.DeckType
        };
    }


    /// <summary>
    /// Explicit cast from <see cref="SessionDto"/> to model <see cref="Session"/>.
    /// </summary>
    public static explicit operator Session(SessionDto dto)
    {
        return new Session(
             id: dto.Id,
             createTime: dto.CreateTime,
             updateTime: dto.UpdateTime,
             generation: dto.Generation,
             participantCountMax: dto.ParticipantCountMax,
             voteCount: dto.VoteCount,
             participants: dto.Participants is not null ? dto.Participants.Select(p => (Participant) p).ToList() : null,
             cards: dto.Cards is not null ? dto.Cards.Select(c => (Card) c).ToList() : null,
             simpleVotes: dto.SimpleVotes is not null ? dto.SimpleVotes.ToList() : null,
             noVote: dto.NoVote is not null ? (Card)dto.NoVote : null,
             notRevealed: dto.NotRevealed is not null ? (Card) dto.NotRevealed : null,
             deckName: dto.DeckName,
             deckType: dto.DeckType
        );
    }
}
