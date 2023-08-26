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
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;



/*  The Redis repository uses the following keys:
 *
 *  sessions (hash)
 *      The keys of this hash are the session indeitifiers.  Each value is a JSON serialized
 *      SessionDto object.
 *
 *  sessions:generation (hash)
 *      The keys are session identifiers.  Each value is an integer representing the generation
 *      for that session.
 *
 *  sessions:lastupdated (hash)
 *      The keys are session identifiers.  Each value is a timestamps represented as the number
 *      of ticks.
 *
 *  sessions:participantsactive:sessionId (hash)
 *      The keys are participant IDs. Each value is a timestamp represented as the
 *      number of ticks.
 *
 *  sessions:metrics (hash)
 *      Metrics collected across all sessions.  The following keys exists:
 *      TotalSessions: Total number of sessions ever created
 *
 *  sessions:log (stream)
 *      Stream with information about the last sessions.  Information is added to the stream when a
 *      session is deleted.  Each stream entry has the following fields:
 *      id
 *      createTime
 *      duration (in seconds)
 */


namespace Spacecowboy.Service.Infrastructure
{
    /// <summary>
    /// A session repository using Redis as the storage backend
    /// </summary>
    public class RedisSessionRepository : ISessionRepository
    {
        // Redis keys
        private readonly static string keySessions = "sessions";
        private readonly static string keySessionsGeneration = "sessions:generation";
        private readonly static string keySessionLastUpdated = "sessions:lastupdated";
        private readonly static string keySessionParticipantsActiveTime = "sessions:participantsactive:";
        private readonly static string keySessionMetrics = "sessions:metrics";
        private readonly static string keySessionLog = "sessions:log";

        // max number of session log entries stored
        private readonly static int maxSessionLogSize = 1000;

        // field names used for the session metrics hash with key keySessionMetrics
        private readonly static string sessionMetricsTotalSessions = "TotalSessions";

        private readonly IMapper map;
        private readonly ILogger<RedisSessionRepository> log;

        private readonly ConnectionMultiplexer redis = ConnectionMultiplexer.Connect("redis");


        public RedisSessionRepository(ILogger<RedisSessionRepository> log, IMapper map)
        {
            this.map = map ?? throw new ArgumentNullException(nameof(map));
            this.log = log;
            log?.LogInformation("Redis session repository starting");
        }


        /// <inheritdoc/>
        public async Task AddSessionAsync(Session session)
        {
            if (session == null) throw new ArgumentNullException(nameof(session));
            var db = redis.GetDatabase();
            var trans = db.CreateTransaction();
            trans.AddCondition(Condition.HashNotExists(keySessions, session.Id));
            _ = trans.HashSetAsync(keySessions, session.Id, JsonSerializer.Serialize(map.Map<SessionDto>(session)));
            var result = await trans.ExecuteAsync();
            if (!result) throw new SessionExistsException(session.Id);
            _ = db.HashIncrementAsync(keySessionMetrics, sessionMetricsTotalSessions);
            await UpdateGenerationAsync(session.Id);
        }


        /// <inheritdoc/>
        public async Task<Session> UpdateSessionAsync(Session session)
        {
            if (session == null) throw new ArgumentNullException(nameof(session));
            var db = redis.GetDatabase();
            var trans = db.CreateTransaction();
            trans.AddCondition(Condition.HashExists(keySessions, session.Id));
            _ = trans.HashSetAsync(keySessions, session.Id, JsonSerializer.Serialize(map.Map<SessionDto>(session)));
            var result = await trans.ExecuteAsync();
            if (!result) throw new SessionNotFoundException(session.Id);
            await UpdateGenerationAsync(session.Id);
            return await GetSessionAsync(session.Id);
        }


        /// <inheritdoc/>
        public async Task DeleteSessionAsync(string id)
        {
            var db = redis.GetDatabase();

            // Write selected statistics on this session to the session log
            try
            {
                var session = await GetSessionAsync(id);
                var sessionInfo = new NameValueEntry[]
                {
                    new NameValueEntry("id", session.Id),
                    new NameValueEntry("createTime", session.CreateTime.ToString("u")),
                    new NameValueEntry("duration", (session.UpdateTime - session.CreateTime).TotalSeconds),
                    new NameValueEntry("maxParticipants", session.ParticipantCountMax),
                    new NameValueEntry("votes", session.VoteCount),
                    new NameValueEntry("deckName", session.DeckName ?? "-"),
                    new NameValueEntry("deckType", session.DeckType ?? "-")
                };
                db.StreamAdd(keySessionLog, sessionInfo, maxLength: maxSessionLogSize, useApproximateMaxLength: true, flags: CommandFlags.FireAndForget);
                log?.LogInformation("Logged statistics on session {sessionId}", id);
            }
            catch (Exception ex)
            {
                log?.LogError(ex, "Unable to store stats for session {sessionId}", id);
            }

            db.HashDelete(keySessions, id, flags: CommandFlags.FireAndForget);
            db.HashDelete(keySessionsGeneration, id, flags: CommandFlags.FireAndForget);
            db.KeyDelete(keySessionParticipantsActiveTime + id, flags: CommandFlags.FireAndForget);
        }


        /// <inheritdoc/>
        public async Task<Session> GetSessionAsync(string id)
        {
            var db = redis.GetDatabase();
            var session = await db.HashGetAsync(keySessions, id);
            string? sessionJson = session;
            if (sessionJson == null) throw new SessionNotFoundException(id);
            try
            {
                var sessionDto = JsonSerializer.Deserialize<SessionDto>(sessionJson);
                if (sessionDto == null) { throw new JsonException("Got null response from JSON deserializer."); }
                await PopulateGenerationAsync(sessionDto);
                await PopulateParticipantsLastActiveTimestampAsync(sessionDto);
                return map.Map<Session>(sessionDto);
            }
            catch (JsonException ex)
            {
                log?.LogError(ex, "Unable to deserialize JSON object for session {id} stored in repository", id);
                throw new SessionNotFoundException(id);
            }
        }


        /// <inheritdoc/>
        public async Task<IEnumerable<string>> GetSessionNamesAsync()
        {
            var db = redis.GetDatabase();
            var keys = await db.HashKeysAsync(keySessions);
            var result = keys.Select(k => k.ToString()).Where(k => k != null);
            return result;
        }


        /// <inheritdoc/>
        public async Task<IEnumerable<Session>> GetSessionsAsync()
        {
            var db = redis.GetDatabase();
            var sessions = await db.HashValuesAsync(keySessions);
            try
            {
                return sessions.Select(s => s.ToString()).Where(s => s != null).Select(s => map.Map<Session>(JsonSerializer.Deserialize<SessionDto>(s)));
            }
            catch (JsonException ex)
            {
                log?.LogError(ex, "Unable to deserialize JSON object for session stored in repository");
                return new List<Session>();
            }
        }


        /// <inheritdoc/>
        public async Task<bool> SessionExistsAsync(string id)
        {
            var db = redis.GetDatabase();
            return await db.HashExistsAsync(keySessions, id);
        }


        /// <inheritdoc/>
        public Task ParticipantHeartbeatAsync(string sessionId, Guid participantId)
        {
            var db = redis.GetDatabase();
            var key = keySessionParticipantsActiveTime + sessionId;
            db.HashSet(key, participantId.ToString(), DateTime.UtcNow.Ticks, flags: CommandFlags.FireAndForget);
            return Task.CompletedTask;
        }


        /// <summary>
        /// Update the generation counter and last modified timestamp for a session
        /// </summary>
        /// <param name="sessionId">Session identifier</param>
        private Task UpdateGenerationAsync(string sessionId)
        {
            var db = redis.GetDatabase();
            db.HashIncrement(keySessionsGeneration, sessionId, flags: CommandFlags.FireAndForget);
            db.HashSet(keySessionLastUpdated, sessionId, DateTime.UtcNow.Ticks, flags: CommandFlags.FireAndForget);
            return Task.CompletedTask;
        }


        private async Task PopulateGenerationAsync(SessionDto session)
        {
            var db = redis.GetDatabase();
            var sessionGeneration = await db.HashGetAsync(keySessionsGeneration, session.Id);
            var sessionLastUpdated = await db.HashGetAsync(keySessionLastUpdated, session.Id);
            session.Generation = (int)sessionGeneration;
            session.UpdateTime = new DateTime((long)sessionLastUpdated, DateTimeKind.Utc);
        }


        /// <summary>
        /// Populates the last active timestamp for each participant in the session object
        /// </summary>
        /// <param name="session">Session object</param>
        private async Task PopulateParticipantsLastActiveTimestampAsync(SessionDto session)
        {
            var db = redis.GetDatabase();
            var key = keySessionParticipantsActiveTime + session.Id;
            if (session.Participants != null) {
                foreach (var p in session.Participants)
                {
                    var participantLastActive = await db.HashGetAsync(key, p.Id.ToString());
                    p.LastActive = new DateTime((long)participantLastActive, DateTimeKind.Utc);
                }
            }
        }


        /// <inheritdoc/>
        public async Task<SessionMetrics> GetMetrics()
        {
            var db = redis.GetDatabase();
            int totalSessions = (int) await db.HashGetAsync(keySessionMetrics, sessionMetricsTotalSessions);
            return new SessionMetrics { TotalSessions = totalSessions };
        }
    }
}
