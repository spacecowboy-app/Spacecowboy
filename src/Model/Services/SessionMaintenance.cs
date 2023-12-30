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

using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;


namespace Spacecowboy.Service.Model
{
    /// <summary>
    /// Service for maintenance tasks across all sessions
    /// </summary>
    public static class SessionMaintenance
    {
        // The amount of inactive time that must pass before an empty session can be deleted
        private static readonly TimeSpan SessionExpiration = new TimeSpan(0, 30, 0);


        /// <summary>
        /// Delete sessions that have been inactive for a long time
        /// </summary>
        /// <param name="repository">Session repository</param>
        /// <param name="log">Logger or <c>null</c> to disable logging</param>
        /// <returns>The number of remaining active sessions</returns>
        public static async Task<int> SessionCleanupAsync(ISessionRepository repository, ILogger log)
        {
            if (repository == null) throw new ArgumentNullException(nameof(repository));

            var expiryTime = DateTime.UtcNow - SessionExpiration;
            var sessions = (await repository.GetSessionsAsync()).Where(s => s.UpdateTime < expiryTime);
            var deleteCount = 0;
            foreach (var s in sessions)
            {
                var activeParticipants = s.GetParticipants().Where(p => p.LastActive > expiryTime);
                if (!activeParticipants.Any())
                {
                    var count = s.GetParticipantsCount();
                    log?.LogInformation("Session cleanup: Deleting session {SessionId} with {Count} participants", s.Id, count);
                    await repository.DeleteSessionAsync(s.Id);
                    deleteCount++;
                }
            }
            var activeSessions = (await repository.GetSessionsAsync()).Count();
            log?.LogInformation("Session cleanup: {0} active sessions, {1} sessions deleted", activeSessions, deleteCount);
            return activeSessions;
        }
    }
}
