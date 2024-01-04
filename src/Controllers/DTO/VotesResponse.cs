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
using Spacecowboy.Service.Model.Entities;


namespace Spacecowboy.Service.Controllers.DTO
{
    /// <summary>
    /// Information about votes cast in a session
    /// </summary>
    public class VotesResponse
    {
        /// <summary>
        /// Number of participants in the session
        /// </summary>
        public int ParticipantCount { get; set; }

        /// <summary>
        /// Number of votes currently cast in the session
        /// </summary>
        public int VoteCount { get; set; }

        /// <summary>
        /// Set when all participants have cast their vote
        /// </summary>
        public bool IsVotingComplete { get; set; }

        /// <summary>
        /// Votes cast in this session
        /// </summary>
        public IEnumerable<VoteResponse> Votes { get; set; }

        public enum VoteStatus
        {
            None = 0,
            Hidden = 1,
            Revealed = 2,
        }

        public record VoteResponse
        {
            public string ParticipantName { get; init; }
            public string? ParticipantAvatar { get; init; }
            public VoteStatus VoteStatus { get; init; }
            public Guid? CardId { get; init; }
            public string? CardValue { get; init; }
            public string? CardImage { get; init; }

            internal VoteResponse(Participant participant, VoteStatus voteStatus, Card? card)
            {
                VoteStatus = voteStatus;
                ParticipantName = participant.Name;
                ParticipantAvatar = participant.Avatar;
                if (card != null && voteStatus == VoteStatus.Revealed)
                {
                    CardId = card.Id;
                    CardValue = card.Value;
                    CardImage = card.Image;
                }
            }

        }

        public VotesResponse(Session session)
        {
            if (session == null) throw new ArgumentNullException(nameof(session));

            ParticipantCount = session.GetParticipants().Count;
            VoteCount = session.GetVoters().Count;
            IsVotingComplete = session.IsVotingComplete();

            var votes = new List<VoteResponse>();
            var voteStatus = session.IsVotingComplete() ? VoteStatus.Revealed : VoteStatus.Hidden;
            foreach(var p in session.GetParticipants())
            {
                var card = session.GetVote(p);
                votes.Add(new VoteResponse(p, card == null ? VoteStatus.None : voteStatus, card));
            }
            Votes = votes;
        }
    }
}
