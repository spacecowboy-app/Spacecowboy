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
/// Represents a card as stored in a repository
/// </summary>
public record CardDto
{
    public required Guid Id { get; init; }
    public string? Value { get; init; }
    public string? Image { get; init; }
    public string? Color { get; init; }
    public string? Font { get; init; }
    public string? Style { get; init; }

    /// <summary>
    /// Explicit cast from model <see cref="Card"/> to <see cref="CardDto"/>.
    /// </summary>
    public static explicit operator CardDto(Card card)
    {
        return new CardDto
        {
            Id = card.Id,
            Value = card.Value,
            Image = card.Image,
            Color = card.Color,
            Font = card.Font,
            Style = card.Style
        };
    }

    /// <summary>
    /// Explicit cast from <see cref="CardDto"/> to model <see cref="Card"/>.
    /// </summary>
    public static explicit operator Card(CardDto dto)
    {
        return new Card
        {
            Id = dto.Id,
            Value = dto.Value,
            Image = dto.Image,
            Color = dto.Color,
            Font = dto.Font,
            Style = dto.Style
        };
    }
}
