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
using Microsoft.Extensions.Logging;
using Spacecowboy.Service.Infrastructure.DTO;
using Spacecowboy.Service.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace Spacecowboy.Service.Infrastructure
{
    /// <summary>
    /// Memory based session repository
    /// </summary>
    /// <remarks>
    /// This is a very basic repository that maintains all data in memory only.  It must be injected as a singleton.
    /// </remarks>
    public class MemorySessionRepository : ISessionRepository
    {
        private readonly IMapper map;
        private readonly ILogger<MemorySessionRepository>? log;

        /// <summary>
        /// Used for concurrency control for the repository
        /// </summary>
        private readonly Object repolock = new object();

        /// <summary>
        /// Dictionary for maintaining session information
        /// </summary>
        private readonly Dictionary<string, SessionDto> sessions = new Dictionary<string, SessionDto>();

        /// <summary>
        /// Dictionary for maintaining generation counter and last update timestamps for each session
        /// </summary>
        private readonly Dictionary<string, SessionGeneration> generations = new Dictionary<string, SessionGeneration>();


        /// <summary>
        /// Last updated timestamps for each participant in each session
        /// </summary>
        private readonly Dictionary<string, Dictionary<Guid, DateTime>> participantsTimestamps = new Dictionary<string, Dictionary<Guid, DateTime>>();


        public MemorySessionRepository(ILogger<MemorySessionRepository>? log, IMapper map)
        {
            this.map = map ?? throw new ArgumentNullException(nameof(map));
            this.log = log;
            log?.LogInformation("Starting MemorySessionRepository");
        }


        /// <inheritdoc/>
        public Task AddSessionAsync(Session session)
        {
            if (session == null) throw new ArgumentNullException(nameof(session));

            lock (repolock)
            {
                if (sessions.ContainsKey(session.Id)) throw new SessionExistsException(session.Id);
                sessions[session.Id] = map.Map<SessionDto>(session);
                UpdateGeneration(session.Id);
                participantsTimestamps[session.Id] = new Dictionary<Guid, DateTime>();
            }
            return Task.CompletedTask;
        }


        /// <inheritdoc/>
        public Task<Session> GetSessionAsync(string id)
        {
            return Task<Session>.FromResult(GetSession(id));
        }


        private Session GetSession(string id)
        {
            if (id == null) throw new ArgumentNullException(nameof(id));

            lock (repolock)
            {
                if (!sessions.ContainsKey(id)) throw new SessionNotFoundException(id);
                var session = sessions[id];
                PopulateGeneration(session);
                PopulateParticipantsLastActiveTimestamp(session);
                return map.Map<Session>(session);
            }
        }


        /// <inheritdoc/>
        public Task<IEnumerable<string>> GetSessionNamesAsync()
        {
            lock (repolock)
            {
                return Task<IEnumerable<string>>.FromResult((IEnumerable<string>) sessions.Keys.ToList());
            }
        }


        /// <inheritdoc/>
        public Task<IEnumerable<Session>> GetSessionsAsync()
        {
            IEnumerable<Session> result;
            lock (repolock)
            {
                result = sessions.Keys.Select(id => GetSession(id)).ToList();
            }
            return Task<IEnumerable<Session>>.FromResult(result);
        }


        /// <inheritdoc/>
        public Task<Session> UpdateSessionAsync(Session session)
        {
            if (session == null) throw new ArgumentNullException(nameof(session));

            lock (repolock)
            {
                if (!sessions.ContainsKey(session.Id)) throw new SessionNotFoundException(session.Id);
                sessions[session.Id] = map.Map<SessionDto>(session);
                UpdateGeneration(session.Id);
                return Task<Session>.FromResult(session);
            }
        }


        /// <inheritdoc/>
        public Task DeleteSessionAsync(string id)
        {
            if (id == null) throw new ArgumentNullException(nameof(id));

            lock (repolock)
            {
                if (!sessions.Remove(id))
                {
                    throw new SessionNotFoundException(id);
                }
                if (!generations.Remove(id))
                {
                    log?.LogError("Inconsistent data structure, {id} not found in generations table", id);
                    throw new SessionNotFoundException(id);
                }
                if (!participantsTimestamps.Remove(id))
                {
                    log?.LogError("Inconsistent data structure, {id} not found in participants timestamps table", id);
                    throw new SessionNotFoundException(id);
                }
            }
            return Task.CompletedTask;
        }


        /// <inheritdoc/>
        public Task<bool> SessionExistsAsync(string id)
        {
            if (id == null) throw new ArgumentNullException(nameof(id));

            lock (repolock)
            {
                return Task<bool>.FromResult(sessions.ContainsKey(id));
            }
        }


        /// <inheritdoc/>
        public Task ParticipantHeartbeatAsync(string sessionId, Guid participantId)
        {
            if (participantsTimestamps.ContainsKey(sessionId))
            {
                participantsTimestamps[sessionId][participantId] = DateTime.UtcNow;
            }
            return Task.CompletedTask;
        }


        /// <summary>
        /// Populates the last active timestamp for each participant in the session object
        /// </summary>
        /// <param name="session">Session object</param>
        private void PopulateParticipantsLastActiveTimestamp(SessionDto session)
        {
            if (!participantsTimestamps.ContainsKey(session.Id))
            {
                log?.LogError("Inconsistent data structure, {Id} not found in participants timestamp table", session.Id);
                throw new SessionNotFoundException(session.Id);
            }
            var timestamps = participantsTimestamps[session.Id];

            if (session.Participants != null) {
                foreach (var p in session.Participants)
                {
                    if (timestamps.ContainsKey(p.Id))
                    {
                        p.LastActive = timestamps[p.Id];
                    }
                }
            }
        }



        /// <summary>
        /// Update the generation counter and last modified timestamp for a session
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        private void UpdateGeneration(string sessionId)
        {
            generations[sessionId] = generations.ContainsKey(sessionId) ? generations[sessionId].Update() : new SessionGeneration();
        }


        /// <summary>
        /// Populate the session with generation counter and last updated timestamp
        /// </summary>
        /// <param name="session">Session to update</param>
        private void PopulateGeneration(SessionDto session)
        {
            if (!generations.ContainsKey(session.Id))
            {
                log?.LogError("Inconsistent data structure, {Id} not found in generations table", session.Id);
                throw new SessionNotFoundException(session.Id);
            }
            session.Generation = generations[session.Id].Generation;
            session.UpdateTime = generations[session.Id].LastModified;
        }


        /// <inheritdoc />
        public Task<SessionMetrics> GetMetrics()
        {
            return Task.FromResult(new SessionMetrics());
        }


        private class SessionGeneration
        {
            public int Generation = 0;
            public DateTime LastModified = DateTime.UtcNow;

            public SessionGeneration Update()
            {
                Generation++;
                LastModified = DateTime.UtcNow;
                return this;
            }
        }
    }
}
