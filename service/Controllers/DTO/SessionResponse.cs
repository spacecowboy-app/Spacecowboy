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
using System.Linq;


namespace Spacecowboy.Service.Controllers.DTO
{
    public class SessionResponse
    {
        /// <summary>
        /// Globally unique session identifier
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// Participants registered in session
        /// </summary>
        public ParticipantResponse[] Participants { get; set; }

        /// <summary>
        /// Cards registered in session
        /// </summary>
        public CardResponse[] Cards { get; set; }

        /// <summary>
        /// A card used to represent a vote that has not yet been cast
        /// </summary>
        public CardResponse NoVote { get; set; }

        /// <summary>
        /// A card used to represent a vote that has not yet been revealed
        /// </summary>
        public CardResponse NotRevealed { get; set; }

        /// <summary>
        /// Time when this session was created
        /// </summary>
        public DateTime CreateTime { get; set; }

        /// <summary>
        /// Time when the session was last updated
        /// </summary>
        public DateTime UpdateTime { get; set; }

        /// <summary>
        /// Generation counter
        /// </summary>
        /// <remarks>
        /// The generation counter is a monotonically increasing value that is automatically updated every time the session object is updated.
        /// It can be used to quickly check for a changed session.
        /// </remarks>
        public int Generation { get; private set; }


        /// <summary>
        /// Indicates that all participants have cast their vote and that voting is thus completed
        /// </summary>
        public bool VotingCompleted { get; private set; }


        /// <summary>
        /// Create SessionResponse from Session
        /// </summary>
        public SessionResponse(Session session, Guid? participantId = null)
        {
            Id = session.Id;
            CreateTime = session.CreateTime;
            UpdateTime = session.UpdateTime;
            Generation = session.Generation;

            NoVote = session.NotRevealed == null ? null : new CardResponse(session.NoVote);
            NotRevealed = session.NotRevealed == null ? null : new CardResponse(session.NotRevealed);
            Cards = session.GetCards()?.Select(c => new CardResponse(c)).ToArray();
            Participants = session.GetParticipantsVotes(false, participantId).Select(v => new ParticipantResponse(v.Participant, v.Card.Id)).ToArray();
            VotingCompleted = session.IsVotingComplete();
        }

    }
}
