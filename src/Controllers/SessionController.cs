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
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Prometheus;
using Spacecowboy.Service.Controllers.DTO;
using Spacecowboy.Service.Controllers.DTO.Errors;
using Spacecowboy.Service.Controllers.Hubs;
using Spacecowboy.Service.Model.Entities;
using Spacecowboy.Service.Model.Exceptions;
using Spacecowboy.Service.Model.Interfaces;
using Spacecowboy.Service.Model.Services;
using Swashbuckle.AspNetCore.Annotations;


namespace Spacecowboy.Service.Controllers
{
    /// <summary>
    /// API for managing a planning session
    /// </summary>
    /// <remarks>
    /// A session consists of a number of participants that cast votes.
    /// </remarks>
    [Route("api/v0/session")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private static readonly Counter sessionsCreated = Metrics.CreateCounter("spacecowboy_sessions_total", "Accumulated number of session creatied",
            new CounterConfiguration
            {
                LabelNames = new[] { "client_name", "client_version" }
            });
        private static readonly Gauge sessionsCurrent = Metrics.CreateGauge("spacecowboy_sessions_current", "Number of active sessions");
        private static readonly Counter participantsTotal = Metrics.CreateCounter("spacecowboy_participants_total", "Accumulated number of participants across all sessions created",
            new CounterConfiguration
            {
                LabelNames = new[] { "avatar", "client_name", "client_version" }
            });
        private static readonly Counter decksTotal = Metrics.CreateCounter("spacecowboy_decks_created_total", "Accumulated number of decks added to a session",
            new CounterConfiguration
            {
                LabelNames = new[] { "deck_name", "deck_type" }
            });

        private readonly ILogger<SessionController> log;
        private readonly IMapper map;
        private readonly ISessionRepository repository;
        private readonly IHubContext<SessionHub>? sessionHub;

        public SessionController(ILogger<SessionController> log, ISessionRepository repository, IMapper map, IHubContext<SessionHub>? hub)
        {
            this.log = log ?? throw new ArgumentNullException(nameof(log));
            this.map = map ?? throw new ArgumentNullException(nameof(map));
            this.repository = repository ?? throw new ArgumentNullException(nameof(repository));
            this.sessionHub = hub;

            if (sessionHub == null)
            {
                log.LogWarning("No session hub provided -- will not send events to clients");
            }
        }


        /// <summary>
        /// Get information about all sessions
        /// </summary>
        /// <response code="200">Information about sessions</response>
        [HttpGet]
        [SwaggerOperation("Get sessions")]
        [ProducesResponseType(typeof(SessionsSummary), StatusCodes.Status200OK)]
        public async Task<ActionResult<SessionsSummary>> GetSessions()
        {
            var sessions = await repository.GetSessionsAsync();
            var sessionsinfo = new SessionsSummary()
            {
                ActiveSessions = sessions.Count()
            };
            return Ok(sessionsinfo);
        }


        /// <summary>
        /// Get a random session name that is currently not in use
        /// </summary>
        /// <remarks>
        /// This method makes a decent effort at creating a random session name that is currently not in use.  If this fails, it returns an
        /// empty string.
        /// </remarks>
        /// <response code="200">A random session name or the empty string if no session name could be found</response>
        [HttpGet("random")]
        [SwaggerOperation("Get random session name")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        public async Task<ActionResult<string>> GetRandomSessionName()
        {
            for (int i=0; i<100; i++)
            {
                var name = GenerateSessionName.getName();
                if (!(await repository.SessionExistsAsync(name)))
                {
                    return "\"" + name + "\"";
                }
            }
            return "\"\"";
        }


        /// <summary>
        /// Get infromation about a session
        /// </summary>
        /// <remarks>
        /// Returns votes only if voting is completed, otherwise returns only an indication of whether a vote has been cast
        /// or not.  By providing an optional participant ID, this method will always return the vote of the specified
        /// participant.
        /// </remarks>
        /// <param name="sessionId">Session identifier</param>
        /// <param name="participantId">Identifier of participant requesting session information</param>
        /// <response code="200">Session information</response>
        /// <response code="404">The session cannot be found</response>
        [HttpGet("{sessionId}")]
        [SwaggerOperation("Get session")]
        [ProducesResponseType(typeof(SessionResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<SessionResponse>> GetSession(string sessionId, [FromQuery] Guid? participantId)
        {
            try
            {
                var session = await repository.GetSessionAsync(sessionId);
                var response = new SessionResponse(session, participantId);
                if (participantId != null)
                {
                    await repository.ParticipantHeartbeatAsync(sessionId, (Guid) participantId);
                }
                log.LogDebug("Get session {SessionId} generation {Generation}", response.Id, response.Generation);
                return response;
            }
            catch (SessionNotFoundException)
            {
                log.LogWarning("Get session {SessionId} not found", sessionId);
                return SessionNotFound(sessionId);
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Get session {SessionId}", sessionId);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }


        /// <summary>
        /// Check for existence of a specific session
        /// </summary>
        /// <remarks>
        /// Intended for quickly checking for the existence of a session.  It does not return any information
        /// about the session, only the HTTP status code is returned.
        /// </remarks>
        /// <param name="sessionId">Session identifier</param>
        /// <response code="200">Session exists</response>
        /// <response code="400">Session ID is invalid</response>
        /// <response code="404">Session does not exist</response>
        [HttpHead("{sessionId}")]
        [SwaggerOperation("Check session")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> CheckSession(string sessionId)
        {
            log.LogDebug("Check session {SessionId}", sessionId);
            if (!Session.IsValidId(sessionId))
                return InvalidSessionName(sessionId);
            try
            {
                return new StatusCodeResult((await repository.SessionExistsAsync(sessionId)) ? StatusCodes.Status200OK : StatusCodes.Status404NotFound);
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Check session {SessionId}", sessionId);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }


        /// <summary>
        /// Create a new session
        /// </summary>
        /// <remarks>
        /// The session name provided as input to this method is the only identifier for the session.
        /// The method will fail and the session will not be created if another session with the same name
        /// already exists.
        /// </remarks>
        /// <param name="sessionId">Session identifier</param>
        /// <response code="201">Session created</response>
        /// <response code="400">The session cannot be created</response>
        /// <response code="409">The session already exists</response>
        [HttpPut("{sessionId}")]
        [SwaggerOperation("Create session")]
        [ProducesResponseType(typeof(SessionResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status409Conflict)]
        public async Task<ActionResult<SessionResponse>> CreateSession(string sessionId)
        {
            try
            {
                await repository.AddSessionAsync(new Session(sessionId));
                log.LogInformation("Created session {SessionId}", sessionId);
                var clientInfo = new ClientInfo(HttpContext?.Request?.Headers?.UserAgent);
                sessionsCreated.WithLabels(clientInfo.Name, clientInfo.Version).Inc();
                sessionsCurrent.Inc();
                return Created("", new SessionResponse(await repository.GetSessionAsync(sessionId)));
            }
            catch (SessionExistsException)
            {
                log.LogInformation("Session {SessionId} already exists and cannot be created", sessionId);
                return CreateSessionAlreadyExists(sessionId);
            }
            catch (InvalidSessionIdException)
            {
                return InvalidSessionName(sessionId);
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Create session {SessionId}", sessionId);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }


        /// <summary>
        /// Delete a session
        /// </summary>
        /// <remarks>
        /// This method is not intended for use in clients.  This method is intented for managing the service and will at some
        /// point require special authorization.
        /// </remarks>
        /// <param name="sessionId">Session identifier</param>
        /// <response code="200">Session deleted</response>
        /// <response code="404">Session does not exist</response>
        [HttpDelete("{sessionId}")]
        [SwaggerOperation("Delete session")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<ActionResult> DeleteSession(string sessionId)
        {
            try
            {
                await repository.DeleteSessionAsync(sessionId);
                log.LogInformation("Session {SessionId} deleted", sessionId);
                sessionsCurrent.Dec();
                return Ok();
            }
            catch (SessionNotFoundException)
            {
                log.LogInformation("Delete session {SessionId} failed, session does not exist", sessionId);
                return SessionNotFound(sessionId);
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Delete session {SessionId} resulted in an unexpected error", sessionId);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }


        /// <summary>
        /// Add a deck of cards to a session
        /// </summary>
        /// <remarks>Add a deck of cards to the session, removing any cards previously added to the session.</remarks>
        /// <param name="sessionId">Session identifier</param>
        /// <param name="deck">Card deck to add to the session</param>
        /// <response code="200">Session cards updated</response>
        /// <response code="404">Session does not exist</response>
        [HttpPut("{sessionId}/deck")]
        [SwaggerOperation("Add deck to session")]
        [ProducesResponseType(typeof(SessionResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<SessionResponse>> AddDeck(string sessionId, [FromBody] AddDeckRequest deck)
        {
            try
            {
                Session session = await repository.GetSessionAsync(sessionId);
                log.LogInformation("Add deck to session {SessionId} using deck {DeckName} of type {DeckType}", sessionId, deck.Name, deck.Type);
                session.RemoveAllCards();
                session.AddDeck(map.Map<Deck>(deck));
                var response = new SessionResponse(await repository.UpdateSessionAsync(session));
                await SessionHub.SendSessionUpdated(sessionHub, response);
                decksTotal.WithLabels(deck.Name ?? "-", deck.Type ?? "-").Inc();
                return response;
            }
            catch (SessionNotFoundException)
            {
                log.LogDebug("Attempt to add deck to non-existing session {SessionId}", sessionId);
                return SessionNotFound(sessionId);
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Add cards to session {SessionId}", sessionId);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }



        /// <summary>
        /// Add s participants to a session
        /// </summary>
        /// <remarks>
        /// Participant names need not be unique.  The service generates a unique identifier for each participant, and
        /// this identifier must be used to uniquely identify a participant in subsequent interactions with the service.
        /// </remarks>
        /// <param name="sessionId">Session identifier</param>
        /// <param name="participant">Participant information</param>
        /// <response code="200">Participant added to session</response>
        /// <response code="404">Session does not exist</response>
        [HttpPost("{sessionId}/participant")]
        [SwaggerOperation("Add a participant to session")]
        [ProducesResponseType(typeof(Participant), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Participant>> AddParticipant(string sessionId, [FromBody] CreateParticipantRequest participant)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(participant.Name))
                {
                    log.LogDebug("Attempt to add participant without specifying a participant name");
                    return ParticipantNameNotSpecified(sessionId);
                }

                Session session = await repository.GetSessionAsync(sessionId);
                var p = new Participant(participant.Name, participant.Avatar, participant.Color);
                session.AddParticipant(p);
                var sessionResponse = new SessionResponse(await repository.UpdateSessionAsync(session));
                await repository.ParticipantHeartbeatAsync(sessionId, p.Id);
                await SessionHub.SendSessionUpdated(sessionHub, sessionResponse);
                var clientInfo = new ClientInfo(HttpContext?.Request?.Headers?.UserAgent);
                participantsTotal.WithLabels(string.IsNullOrWhiteSpace(participant.Avatar) ? "-" : participant.Avatar, clientInfo.Name, clientInfo.Version).Inc();
                log.LogInformation("Add participant {Participant} to session {SessionId}", p, sessionId);
                return Ok(p);
            }
            catch (SessionNotFoundException)
            {
                log.LogDebug("Attempt to add participant to non-existing session {SessionId}", sessionId);
                return SessionNotFound(sessionId);
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Add participant to session {SessionId}", sessionId);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }


        /// <summary>
        /// Remove a participant from a session
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        /// <param name="participantId">Participant identrifier</param>
        /// <response code="200">Participant removed from the session</response>
        /// <response code="404">Session or participant does not exist</response>
        [HttpDelete("{sessionId}/participant/{participantId}")]
        [SwaggerOperation("Remove participant from session")]
        [ProducesResponseType(typeof(SessionResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<SessionResponse>> RemoveParticipant(string sessionId, Guid participantId)
        {
            try
            {
                Session session = await repository.GetSessionAsync(sessionId);
                var participant = session.Participants.FirstOrDefault(p => p.Id == participantId);
                if (participant == null)
                {
                    log.LogDebug("Attempting to remove participant {ParticipantId} from session {SessionId} but participant is not a member of that session", participantId, sessionId);
                    return ParticipantNotFound(sessionId, participantId);
                }
                session.RemoveParticipant(participantId);
                log.LogInformation("Removed participant {Participant} from session {SessionId}", participant, sessionId);
                var sessionResponse = new SessionResponse(await repository.UpdateSessionAsync(session));
                await SessionHub.SendSessionUpdated(sessionHub, sessionResponse);
                return sessionResponse;
            }
            catch (SessionNotFoundException)
            {
                log.LogDebug("Attempt to remove participant from non-existing session {SessionId}", sessionId);
                return SessionNotFound(sessionId);
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Remove participant {ParticipantId} from session {SessionId}", participantId, sessionId);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }


        /// <summary>
        /// Get votes cast in the session
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        /// <returns>Votes cast in session</returns>
        /// <response code="200">Votes retrieved</response>
        /// <response code="404">Session does not exist</response>
        [HttpGet("{sessionId}/vote")]
        [SwaggerOperation("Get votes")]
        [ProducesResponseType(typeof(VotesResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<VotesResponse>> GetVotes(string sessionId)
        {
            try
            {
                Session session = await repository.GetSessionAsync(sessionId);
                var response = new VotesResponse(session);
                return response;
            }
            catch (SessionNotFoundException)
            {
                log.LogInformation("Get votes for session {SessionId} failed, session does not exist", sessionId);
                return SessionNotFound(sessionId);
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Get votes in session {SessionId} resulted in unexpected error", sessionId);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }


        /// <summary>
        /// Delete votes cast in session
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        /// <response code="200">Votes cleared</response>
        /// <response code="404">Session does not exist</response>
        [HttpDelete("{sessionId}/vote")]
        [SwaggerOperation("Delete votes")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<ActionResult> DeleteVotes(string sessionId)
        {
            try
            {
                Session session = await repository.GetSessionAsync(sessionId);
                session.ClearVotes();
                var sessionResponse = new SessionResponse(await repository.UpdateSessionAsync(session));
                await SessionHub.SendSessionVotesCleared(sessionHub, sessionId);
                await SessionHub.SendSessionUpdated(sessionHub, sessionResponse);
                log.LogDebug("Deleted all votes in session {SessionId}", session.Id);
                return Ok();
            }
            catch (SessionNotFoundException)
            {
                log.LogDebug("Attempting to delete votes from non-existing session {SessionId}", sessionId);
                return SessionNotFound(sessionId);
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Clear votes from session {SessionId}", sessionId);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }


        /// <summary>
        /// Cast a vote
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        /// <param name="participantId">Participant identifier</param>
        /// <param name="cardId">Id of card representing the Vote</param>
        /// <response code="200">Vote cast</response>
        /// <response code="404">Specified session, participant or card does not exist</response>
        /// <response code="409">Vote rejected as voting is completed</response>
        [HttpPut("{sessionId}/vote/{participantId}/{cardId}")]
        [SwaggerOperation("Cast a vote")]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(ErrorDetails), 404)]
        [ProducesResponseType(typeof(ErrorDetails), 409)]
        public async Task<ActionResult> CastVote(string sessionId, Guid participantId, Guid cardId)
        {
            try
            {
                Session session = await repository.GetSessionAsync(sessionId);

                var participant = session.Participants.FirstOrDefault(p => p.Id == participantId);
                var card = session.Cards.FirstOrDefault(c => c.Id == cardId);
                if (participant == null) throw new ParticipantNotFoundException(sessionId, participantId);
                if (card == null) throw new CardNotFoundException(sessionId, cardId);

                if (!session.AddVote(participantId, cardId))
                {
                    log.LogInformation("Vote {Card} from participant {Participant} in ession {sessionId} rejected as voting is completed", card, participant, sessionId);
                    return VotingCompleted(sessionId, participantId, cardId);
                }

                var sessionResponse = new SessionResponse(await repository.UpdateSessionAsync(session));
                await SessionHub.SendSessionUpdated(sessionHub, sessionResponse);
                log.LogInformation("Participant {Participant} cast vote {Card} in session {SessionId}", participant, card, sessionId);
                return Ok();
            }
            catch (SessionNotFoundException)
            {
                log.LogWarning("Request to cast vote in session {SessionId} by participant {ParticipantId} failed, session does not exist", sessionId, participantId);
                return SessionNotFound(sessionId);
            }
            catch (ParticipantNotFoundException)
            {
                log.LogWarning("Request to cast vote for participant {ParticipantId} in session {SessionId} failed, participant does not exist", participantId, sessionId);
                return ParticipantNotFound(sessionId, participantId);
            }
            catch (CardNotFoundException)
            {
                log.LogWarning("Request to cast vote with card {CardId} in session {SessionId} by participant {ParticipantId} failed, card does not exist", cardId, sessionId, participantId);
                return CardNotFound(sessionId, cardId);
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Cast vote in session {SessionId}", sessionId);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }


        /// <summary>
        /// Clean up abandoned sessions
        /// </summary>
        /// <remarks>
        /// Removes all sessions without any participants that have been idle for some time.
        /// Call this method periodically reclaim resources allocated to abandoned sessions.
        /// </remarks>
        [HttpGet("cleanup")]
        [SwaggerOperation("Cleanup sessions")]
        public async Task<ActionResult> CleanupSessions()
        {
            var sessions = await SessionMaintenance.SessionCleanupAsync(repository, log);
            sessionsCurrent.Set(sessions);
            return Ok();
        }


        /// <summary>
        /// Return error details session does not exist
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        private ActionResult SessionNotFound(string sessionId) =>
            NotFound(new NotFoundErrorDetails("The specified session does not exist") {  SessionId = sessionId });


        /// <summary>
        /// Return error details for a participant that does not exist in a specific session
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        /// <param name="participantId">Partcicipant identifier</param>
        private ActionResult ParticipantNotFound(string sessionId, Guid participantId) =>
            NotFound(new NotFoundErrorDetails("The specified participant does not exist in the session") { SessionId = sessionId, ParticipantId = participantId});


        /// <summary>
        /// Return error details for a card that does not exist in a specific session
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        /// <param name="cardId">Card identifier</param>
        /// <returns></returns>
        private ActionResult CardNotFound(string sessionId, Guid cardId) =>
            NotFound(new NotFoundErrorDetails("The specified card does not exist in the session") { SessionId = sessionId, CardId = cardId });


        /// <summary>
        /// Return error for attempting to create a session that already exists
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        private ActionResult CreateSessionAlreadyExists(string sessionId) =>
            Conflict(new ConflictErrorDetails("Session cannot be created since it already exists") { SessionId = sessionId });


        /// <summary>
        /// Return error details for an invalid session identifier
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        private ActionResult InvalidSessionName(string sessionId) =>
            BadRequest(new BadRequestErrorDetails("The specified session identifier is invalid") { SessionId = sessionId });

        /// <summary>
        /// Return error details for a missing participant name
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        private ActionResult ParticipantNameNotSpecified(string sessionId) =>
            BadRequest(new BadRequestErrorDetails("The participant name must be specified") {  SessionId= sessionId });

        /// <summary>
        /// Return error details for attempt at casting a vote in a session where voting is completed
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        /// <param name="participantId">Identifier of participant attempting to cast the vote</param>
        /// <param name="cardId">Identifier of card attempted to be cast as a vote</param>
        private ActionResult VotingCompleted(string sessionId, Guid participantId, Guid cardId) =>
            Conflict(new ConflictErrorDetails("Vote rejected because voting is finished") { SessionId = sessionId, ParticipantId = participantId, CardId = cardId });
    }


    public struct ClientInfo
    {
        public string Name;
        public string Version;

        public ClientInfo(string? userAgent)
        {
            if (userAgent == null) {
                Name = "";
                Version = "";
            }
            else {
                var separatorPos = userAgent.LastIndexOf('/');
                if (separatorPos < 1) {
                    Name = userAgent;
                    Version = "";
                }
                else {
                    Name = userAgent.Substring(0, separatorPos);
                    Version = userAgent.Substring(separatorPos + 1);
                }
            }
        }
    }
}
