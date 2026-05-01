/*
    Copyright 2021-2026 Rolf Michelsen and Tami Weiss

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

using Spacecowboy.Service.Model.Entities;

namespace Spacecowboy.Service.Infrastructure.DTO;

/// <summary>
/// Represents a participant as stored in a repository
/// </summary>
public record ParticipantDto
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public string? Avatar { get; init; }
    public string? Color { get; init; }
    public DateTime LastActive { get; set; }

    /// <summary>
    /// Explicit cast from model <see cref="Participant"/> to <see cref="ParticipantDto"/>.
    /// </summary>
    public static explicit operator ParticipantDto(Participant participant)
    {
        return new ParticipantDto
        {
            Id = participant.Id,
            Name = participant.Name,
            Avatar = participant.Avatar,
            Color = participant.Color,
            LastActive = participant.LastActive
        };
    }

    /// <summary>
    /// Explicit cast from <see cref="ParticipantDto"/> to model <see cref="Participant"/>.
    /// </summary>
    public static explicit operator Participant(ParticipantDto dto)
    {
        return new Participant
        {
            Id = dto.Id,
            Name = dto.Name,
            Avatar = dto.Avatar,
            Color = dto.Color,
            LastActive = dto.LastActive
        };
    }
}
