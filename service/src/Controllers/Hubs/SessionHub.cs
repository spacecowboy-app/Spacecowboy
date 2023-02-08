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

using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Spacecowboy.Service.Controllers.DTO;
using Spacecowboy.Service.Model;
using System;
using System.Threading.Tasks;


namespace Spacecowboy.Service.Controllers.Hubs
{
    public class SessionHub: Hub
    {
        private static readonly string EventSessionUpdated = "SessionUpdated";
        private static readonly string EventSessionVotesCleader = "SessionVotesCleared";
        private static readonly string EventMessage = "Message";

        private readonly ILogger<SessionHub> log;
        private readonly ISessionRepository repo;
        private readonly IMapper map;


        public SessionHub(ILogger<SessionHub> log, ISessionRepository repo, IMapper map)
        {
            this.log = log;
            this.repo = repo;
            this.map = map;
        }


        /// <inheritdoc/>
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            await Clients.Caller.SendAsync(EventMessage, "Connected to service hub");
            log?.LogInformation("Client connected to SessionsHub");
        }


        /// <inheritdoc/>
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Clients.Caller.SendAsync(EventMessage, "Disconnected from service hub");
            await base.OnDisconnectedAsync(exception);
            log?.LogInformation("Client disconnected from SessionsHub");
        }


        /// <summary>
        /// Add a client as a subscriber to events for a given session
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        public async Task SubscribeSession(string sessionId)
        {
            try
            {
                var session = await repo.GetSessionAsync(sessionId);
                await Groups.AddToGroupAsync(Context.ConnectionId, SessionGroupName(sessionId));
                await Clients.Caller.SendAsync(EventSessionUpdated, new SessionResponse(session));
                log?.LogInformation("Participant subscribed to session {sessionId}", sessionId);

            }
            catch (SessionNotFoundException)
            {
                log?.LogWarning("Participant attempted to subscribe to non-existing session {sessionId}", sessionId);
            }
        }


        /// <summary>
        /// Remove a client as a subscriber to events for a given session
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        public async Task UnsubscribeSession(string sessionId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, SessionGroupName(sessionId));
            log?.LogInformation("Participant unsubscribed to session {sessionId}", sessionId);
        }


        /// <summary>
        /// Participant heartbeat
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        /// <param name="participantId">Participant identifier</param>
        public async Task ParticipantHeartbeat(string sessionId, Guid participantId)
        {
            if (repo != null)
            {
                await repo.ParticipantHeartbeatAsync(sessionId, participantId);
            }
            else
            {
                log?.LogWarning("Participant heartbeat for session {sessionId} requested when no repository is configured", sessionId);
            }
        }


        /// <summary>
        /// Return session information to a client
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        /// <returns>Session information or null on error</returns>
        public async Task<SessionResponse> GetSession(string sessionId)
        {
            if (repo == null)
            {
                log?.LogWarning("Session information requested for session {sessionId} but no repository is configured", sessionId);
                return null;
            }

            try
            {
                var session = await repo.GetSessionAsync(sessionId);
                var response = new SessionResponse(session);
                return response;
            }
            catch (SessionNotFoundException)
            {
                log?.LogWarning("Get information for session {sessionId} that does not exist", sessionId);
                return null;
            }
            catch (Exception ex)
            {
                log?.LogError(ex, "Get session {sessionId}", sessionId);
                return null;
            }
        }

        
        /// <summary>
        /// Sends updated session information to all clients subscribed to the session's group
        /// </summary>
        /// <param name="hub">Hub context</param>
        /// <param name="session">Session information</param>
        public static async Task SendSessionUpdated(IHubContext<SessionHub> hub, SessionResponse session)
        {
            if (hub != null)
            {
                if (session == null) throw new ArgumentNullException(nameof(session));
                await hub.Clients.Group(SessionGroupName(session.Id)).SendAsync(EventSessionUpdated, session);
            }
        }


        /// <summary>
        /// Sends an event indicating that all votes have been cleared
        /// </summary>
        /// <param name="hub">Hub context</param>
        /// <param name="sessionId">Session identifier</param>
        public static async Task SendSessionVotesCleared(IHubContext<SessionHub> hub, string sessionId)
        {
            if (hub != null)
            {
                if (sessionId == null) throw new ArgumentNullException(nameof(sessionId));
                await hub.Clients.Group(SessionGroupName(sessionId)).SendAsync(EventSessionVotesCleader);
            }
        }


        /// <summary>
        /// Returns a group name for the participants in a given session
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        private static string SessionGroupName(string sessionId)
        {
            return $"Session-{sessionId}";
        }
    }
}
