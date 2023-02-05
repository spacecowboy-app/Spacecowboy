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

using Spacecowboy.Service.Model;
using System;
using System.Collections.Generic;


namespace Spacecowboy.Service.Infrastructure.DTO
{
    /// <summary>
    /// Represents a session as stored in a repository
    /// </summary>
    public class SessionDto
    {
        public string Id { get; set; }
        public DateTime CreateTime { get; set; }
        public DateTime UpdateTime { get; set; }
        public int Generation { get; set; }
        public IEnumerable<ParticipantDto> Participants { get; set; }
        public IEnumerable<CardDto> Cards { get; set; }
        public IEnumerable<SimpleVote> SimpleVotes { get; set; }
        public CardDto NoVote { get; set; }
        public CardDto NotRevealed { get; set; }
        public int ParticipantCountMax { get; set; }
        public int VoteCount { get; set; }
        public string DeckName { get; set; }
        public string DeckType { get; set; }
    }
}
