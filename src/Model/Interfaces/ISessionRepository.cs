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
using System.Threading.Tasks;
using Spacecowboy.Service.Model.Entities;
using Spacecowboy.Service.Model.Exceptions;


namespace Spacecowboy.Service.Model.Interfaces;

/// <summary>
/// Repository for voting sessions
/// </summary>
/// <remarks>
/// The session repository is not only responsible for storing voting sessions.  It is also responsible for
/// managing the session last updated timestamp and generation counter.  It will populate these properties in
/// returned session objects.  It will disregard these properties when storing a session.
/// </remarks>
public interface ISessionRepository
{
    /// <summary>
    /// Retrieve the identifiers of all sessions
    /// </summary>
    /// <returns>Session identifiers</returns>
    public Task<IEnumerable<string>> GetSessionNamesAsync();

    /// <summary>
    /// Retrieve all sessions
    /// </summary>
    /// <returns>All session entities</returns>
    public Task<IEnumerable<Session>> GetSessionsAsync();

    /// <summary>
    /// Retrieve a specific session
    /// </summary>
    /// <param name="id">Session identifier</param>
    /// <returns>The identified session entity</returns>
    /// <exception cref="SessionNotFoundException">A session with the given identifier does not exist</exception>
    public Task<Session> GetSessionAsync(string id);

    /// <summary>
    /// Add a new session to the repository
    /// </summary>
    /// <remarks>
    /// This method updates the session generation.
    /// </remarks>
    /// <param name="session">Session to add</param>
    /// <exception cref="SessionExistsException">A session with the same identifier already exists in the repository</exception>
    /// <exception cref="ArgumentException">The session is invalid</exception>
    public Task AddSessionAsync(Session session);


    /// <summary>
    /// Update a session already in the respository
    /// </summary>
    /// <remarks>
    /// This method updates the session generation.
    /// </remarks>
    /// <param name="session">Session to update</param>
    /// <returns>The updated session</returns>
    /// <exception cref="SessionNotFoundException">This session does not exist in the repository</exception>
    public Task<Session> UpdateSessionAsync(Session session);


    /// <summary>
    /// Deletes a session from the repository
    /// </summary>
    /// <param name="id">Session identifier</param>
    /// <exception cref="SessionNotFoundException">A session with the given identifier does not exist</exception>
    public Task DeleteSessionAsync(string id);


    /// <summary>
    /// Check whether a session exists in the repository
    /// </summary>
    /// <param name="id">Session identifier</param>
    /// <returns>True if a session with the given identifier exists in the repository</returns>
    public Task<bool> SessionExistsAsync(string id);


    /// <summary>
    /// Update the last active timestamp for a participant
    /// </summary>
    /// <remarks>
    /// This method will do nothing if the session or participant do not exist.  Note that this method will not
    /// update the session generation.
    /// </remarks>
    /// <param name="sessionId">Session identifier</param>
    /// <param name="participantId">Participant identifier</param>
    public Task ParticipantHeartbeatAsync(string sessionId, Guid participantId);


    /// <summary>
    /// Returns persisted session metrics
    /// </summary>
    public Task<SessionMetrics> GetMetrics();
}
