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
using System.ComponentModel.DataAnnotations;

namespace Spacecowboy.Service.Controllers.DTO
{
    /// <summary>
    /// Information about the session to be created
    /// </summary>
    public class CreateSessionRequest
    {
        /// <summary>
        /// Globally unique session identifier
        /// </summary>
        [Required]
        public string Id { get; set; }

        /// <summary>
        /// List of session participants
        /// </summary>
        public CreateParticipantRequest[] Participants { get; set; }


        /// <summary>
        /// List of session cards
        /// </summary>
        public CreateCardRequest[] Cards { get; set; }

        /// <summary>
        /// A card used to represent a vote that has not yet been cast
        /// </summary>
        public Card NoVote { get; set; }

        /// <summary>
        /// A card used to represent a vote that has not yet been revealed
        /// </summary>
        public Card NotRevealed { get; set; }

        // TODO: This method should be replaced with a proper Automapper configuration
        public Session GetSession()
        {
            Session session = new Session(Id);
            AddParticipants(session, Participants);
            AddCards(session, Cards);
            return session;
        }


        private void AddParticipants(Session session, CreateParticipantRequest[] participants)
        {
            if (participants != null)
            {
                foreach (var p in participants)
                {
                    session.AddParticipant(new Participant(p.Name, p.Avatar, p.Color));
                }
            }
        }


        private void AddCards(Session session, CreateCardRequest[] cards)
        {
            if (cards != null)
            {
                foreach (var c in cards)
                {
                    session.AddCard(new Card(c.Value, c.Image, c.Color, c.Font, c.Style));
                }
            }
        }

    }
}
