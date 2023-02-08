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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;


namespace Spacecowboy.Service.Model
{
    /// <summary>
    /// A session
    /// </summary>
    public class Session
    {
        /// <summary>
        /// List of participants in this session with participant ID as key
        /// </summary>
        private readonly Dictionary<Guid, Participant> participants = new Dictionary<Guid, Participant>();

        /// <summary>
        /// Collection of cards that can be cast as votes in this session with card ID as key
        /// </summary>
        private Dictionary<Guid, Card> cards = new Dictionary<Guid, Card>();

        /// <summary>
        /// List of votes cast in this session
        /// </summary>
        /// <remarks>
        /// The key is the ID of the participant having cast the vote.  The value is the ID of the card.
        /// </remarks>
        private readonly Dictionary<Guid, SimpleVote> votes = new Dictionary<Guid, SimpleVote>();

        /// <summary>
        /// Globally unique session identifier
        /// </summary>
        public string Id { get; }

        /// <summary>
        /// Time when the session was created
        /// </summary>
        public DateTime CreateTime { get; private set; }

        /// <summary>
        /// A card used to represent a vote that has not yet been cast
        /// </summary>
        public Card NoVote { get; set; }

        /// <summary>
        /// A card used to represent a vote that has not yet been revealed
        /// </summary>
        public Card NotRevealed { get; set; }

        /// <summary>
        /// Name of card deck used in session
        /// </summary>
        public string DeckName { get; set; }

        /// <summary>
        /// Type of card deck used in session
        /// </summary>
        public string DeckType { get; set; }


        /// <summary>
        /// All participants in this session
        /// </summary>
        public ICollection<Participant> Participants
        {
            get => GetParticipants();
            private set { AddParticipants(value); }
        }


        /// <summary>
        /// All cards in this session
        /// </summary>
        public ICollection<Card> Cards
        {
            get => GetCards();
            private set { AddCards(value); }
        }

        public ICollection<SimpleVote> SimpleVotes
        {
            get => votes.Values;
            private set { AddVotes(value); }
        }


        /// <summary>
        /// Generation counter
        /// </summary>
        /// <remarks>
        /// The generation counter is a monotonically increasing value that is automatically updated every time the session object is updated.
        /// It can be used to quickly check for a changed session.  It is the session repository that is responsible for updating the
        /// generation.
        /// </remarks>
        public int Generation { get; private set; }


        /// <summary>
        /// Time when the session was last updated
        /// </summary>
        public DateTime UpdateTime { get; private set; }


        /// <summary>
        /// Total number of votes cast in this session
        /// </summary>
        public int VoteCount { get; private set; }


        /// <summary>
        /// The maximum number of participants in this session
        /// </summary>
        public int ParticipantCountMax { get; private set; }


        /// <summary>
        /// The number of participants currently in the session
        /// </summary>
        public int ParticipantCount => participants.Count;


        public Session(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) throw new ArgumentException("Argument cannot be null or whitespace", nameof(id));
            if (!IsValidId(id)) throw new InvalidSessionIdException(nameof(id));
            Id = id;
            CreateTime = DateTime.UtcNow;
            VoteCount = 0;
            ParticipantCountMax = 0;
        }


        /// <summary>
        /// Add a participant to the session
        /// </summary>
        /// <param name="participant">Participant to add to the session</param>
        /// <returns>The number of participants now in the session</returns>
        /// <exception cref="ArgumentException">Participant is already registered in this session</exception>
        public int AddParticipant(Participant participant)
        {
            if (participant != null)
            {
                if (participants.ContainsKey(participant.Id)) throw new ArgumentException($"Participant with id {participant.Id} already added to session");
                participants.Add(participant.Id, participant);
                ParticipantCountMax = Math.Max(ParticipantCountMax, participants.Count);
            }
            return participants.Count;
        }


        /// <summary>
        /// Add seveal participants to the session
        /// </summary>
        /// <param name="participants">Participants to be added to the session</param>
        /// <returns>The number of participants now in the session</returns>
        /// <exception cref="ArgumentException">Participant is already registered in this session</exception>
        public int AddParticipants(IEnumerable<Participant> participants)
        {
            if (participants != null)
            {
                foreach (var p in participants)
                    AddParticipant(p);
            }
            return this.participants.Count;
        }


        /// <summary>
        /// Remove a participant from the session
        /// </summary>
        /// <param name="id">ID of participant to be removed from the sesison</param>
        /// <returns>The number of participants now in the session</returns>
        public int RemoveParticipant(Guid id)
        {
            if (!participants.ContainsKey(id)) throw new ArgumentException($"Participant with id {id} is not registered in this session");
            participants.Remove(id);
            if (votes.ContainsKey(id))
                votes.Remove(id);
            return participants.Count;
        }


        /// <summary>
        /// True if the session contains a participant with the given ID
        /// </summary>
        /// <param name="id">ID of participant</param>
        /// <returns>True if the participant is registered in the session</returns>
        public bool ContainsParticipant(Guid id)
        {
            return participants.ContainsKey(id);
        }

        /// <summary>
        /// Return all participants in the session
        /// </summary>
        /// <returns>All participants in the session</returns>
        public ICollection<Participant> GetParticipants()
        {
            return participants.Values.ToList<Participant>().AsReadOnly();
        }

        /// <summary>
        /// Returns the number of participants in the session
        /// </summary>
        /// <returns>Number of participants</returns>
        public int GetParticipantsCount()
        {
            return participants.Count;
        }

        /// <summary>
        /// Return all cards permitted for votes in this session
        /// </summary>
        /// <returns>All cards for this session</returns>
        public ICollection<Card> GetCards()
        {
            return cards.Values.ToList<Card>().AsReadOnly();
        }


        /// <summary>
        /// Add a deck of cards to the session
        /// </summary>
        /// <param name="deck"></param>
        public void AddDeck(Deck deck)
        {
            if (deck == null)
            {
                throw new ArgumentNullException(nameof(deck));
            }
            DeckName = deck.Name;
            DeckType = deck.Type;
            AddCards(deck.Cards);
            NoVote = deck.NoVote;
            NotRevealed = deck.NotRevealed;
        }


        /// <summary>
        /// Add a card to the session
        /// </summary>
        /// <param name="card">Card to add to the session</param>
        /// <returns>The number of cards now in the session</returns>
        /// <exception cref="ArgumentException">Card is already registered in this session</exception>
        public int AddCard(Card card)
        {
            if (card != null)
            {
                if (cards.ContainsKey(card.Id)) throw new ArgumentException($"Card with id {card.Id} already added to session");
                cards.Add(card.Id, card);
            }
            return cards.Count;
        }


        /// <summary>
        /// Add cards to the session
        /// </summary>
        /// <param name="cards">Cards to add to the session</param>
        /// <returns>The number of cards now in the session</returns>
        /// <exception cref="ArgumentException">Card is already registered in this session</exception>
        public int AddCards(IEnumerable<Card> cards)
        {
            if (cards != null)
            {
                foreach (var c in cards)
                    AddCard(c);
            }
            return this.cards.Count;
        }


        /// <summary>
        /// Remove a card from the session
        /// </summary>
        /// <param name="id">ID of card to be removed from the sesison</param>
        /// <returns>The number of cards now in the session</returns>
        public int RemoveCard(Guid id)
        {
            if (!cards.ContainsKey(id)) throw new ArgumentException($"Card with id {id} is not registered in this session");
            cards.Remove(id);
            return cards.Count;
        }


        /// <summary>
        /// Remove all cards from the session
        /// </summary>
        public void RemoveAllCards()
        {
            cards = new Dictionary<Guid, Card>();
        }


        /// <summary>
        /// True if the session contains a card with the given ID
        /// </summary>
        /// <param name="id">ID of card</param>
        /// <returns>True if the card is registered in the session</returns>
        public bool ContainsCard(Guid id)
        {
            return cards.ContainsKey(id);
        }


        /// <summary>
        /// Remove all cast votes from the session
        /// </summary>
        public void ClearVotes()
        {
            votes.Clear();
        }


        /// <summary>
        /// Retrieve all participants that have cast a vote in the session
        /// </summary>
        /// <returns></returns>
        public ICollection<Participant> GetVoters()
        {
            var voters = new List<Participant>();
            foreach (var p in votes.Keys) {
                voters.Add(participants[p]);
            }
            return voters;
        }


        /// <summary>
        /// Retrieve all votes cast in the session
        /// </summary>
        /// <returns></returns>
        public ICollection<Vote> GetVotes()
        {
            var response = new List<Vote>();
            foreach (var k in votes.Keys)
            {
                response.Add(new Vote(participants[k], cards[votes[k].CardId]));
            }
            return response;
        }


        /// <summary>
        /// Retrieve all participants and their corresponding vote
        /// </summary>
        /// <remarks>
        /// This method returns one item for each participant.  If a participant has not yet cast a vote, the returned vote will be <see cref="NoVote"/>.
        /// If at least one participant has not yet cast a vote, all votes are represented by <see cref="NotRevealed"/> unless <paramref name="alwaysReveal"/>
        /// is set.  If <see cref="NoVote"/> or <see cref="NotRevealed"/> is not defined, <c>null</c> is returned instead.
        /// </remarks>
        /// <param name="alwaysReveal">Always return votes, even if not all participants have voted</param>
        /// <param name="participantReveal">Always reveal the vote of the specified participant</param>
        /// <returns>One vote for each session participant</returns>
        public ICollection<Vote> GetParticipantsVotes(bool alwaysReveal, Guid? participantReveal=null)
        {
            var revealVotes = alwaysReveal || IsVotingComplete();
            return participants.Values.Select(p => new Vote(p, GetParticipantVoteCard(p.Id, revealVotes || (p.Id == participantReveal)))).ToList() ;
        }


        /// <summary>
        /// Return the vote card for a participant
        /// </summary>
        /// <param name="participantId"></param>
        /// <param name="revealVotes"></param>
        /// <returns></returns>
        public Card GetParticipantVoteCard(Guid participantId, bool revealVotes)
        {
            return votes.ContainsKey(participantId) ? (revealVotes ? cards[votes[participantId].CardId] : NotRevealed) : NoVote;
        }


        /// <summary>
        /// Return the vote cast by a given participant
        /// </summary>
        /// <param name="participant">Participant whose vote to return</param>
        /// <returns>Vote or null if no vote has been cast</returns>
        public Card GetVote(Participant participant)
        {
            if (participant == null) throw new ArgumentNullException(nameof(participant));
            return GetVote(participant.Id);
        }


        /// <summary>
        /// Return the vote cast by a given participant
        /// </summary>
        /// <param name="participantId">Participant whose vote to return</param>
        /// <returns>Vote or null if no vote has been cast</returns>
        public Card GetVote(Guid participantId)
        {
            return votes.ContainsKey(participantId) ? cards[votes[participantId].CardId] : null;
        }


        /// <summary>
        /// Add a vote for a given participant
        /// </summary>
        /// <remarks>
        /// It is permitted for a participant to cast multiple votes, in which case the last vote will count.
        /// Votes will be rejected if the voting is complete.
        /// </remarks>
        /// <returns>True if the vote was accepted</returns>
        /// <param name="participantId">Participant identifier</param>
        /// <param name="cardId">Id of card cast as vote</param>
        /// <exception cref="ParticipantNotFoundException">This participant is not registered in this session</exception>
        /// <exception cref="CardNotFoundException">This card is not registered in this session</exception>
        public bool AddVote(Guid participantId, Guid cardId)
        {
            if (!participants.ContainsKey(participantId)) throw new ParticipantNotFoundException(Id, participantId);
            if (!cards.ContainsKey(cardId)) throw new CardNotFoundException(Id, cardId);
            if (IsVotingComplete())
                return false;
            votes[participantId] = new SimpleVote(participantId, cardId);
            VoteCount++;
            return true;
        }


        private void AddVotes(IEnumerable<SimpleVote> votes)
        {
            if (votes != null)
            {
                foreach (var v in votes)
                    AddVote(v.ParticipantId, v.CardId);
            }
        }


        /// <summary>
        /// Add a vote for a given participant
        /// </summary>
        /// <remarks>
        /// It is permitted for a participant to cast multiple votes, in which case the last vote will count.
        /// Votes will be rejected if the voting is complete.        
        /// </remarks>
        /// <param name="participant">Participant</param>
        /// <param name="card">Card cast as vote</param>
        /// <exception cref="ParticipantNotFoundException">This participant is not registered in this session</exception>
        /// <exception cref="CardNotFoundException">This card is not registered in this session</exception>
        public void AddVote(Participant participant, Card card)
        {
            if (participant == null) throw new ArgumentNullException(nameof(participant));
            if (card == null) throw new ArgumentNullException(nameof(card));
            AddVote(participant.Id, card.Id);
        }


        /// <summary>
        /// True if all participants have cast a vote
        /// </summary>
        /// <returns>True if all participants have cast a vote</returns>
        public bool IsVotingComplete()
        {
            return (votes.Count == participants.Count);
        }


        /// <summary>
        /// Validates a session identifier and returns <code>true</code> if it is valid
        /// </summary>
        public static bool IsValidId(string id)
        {
            return Regex.Match(id, @"^[a-zA-Z0-9\-]+$").Success;
        }
    }


    public struct SimpleVote
    {
        public SimpleVote(Guid participantId, Guid cardId)
        {
            ParticipantId = participantId;
            CardId = cardId;
        }

        public Guid ParticipantId { get; set; }
        public Guid CardId { get; set; }
    }
}
