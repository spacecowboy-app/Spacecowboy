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


namespace Spacecowboy.Service.Model.Entities;

/// <summary>
/// A voting card
/// </summary>
/// <remarks>
/// A session contains a set of voting cards.  Each vote must be one of the permitted voting cards.
/// </remarks>
public record Card
{
    /// <summary>
    /// Vote card ID
    /// </summary>
    public Guid Id { get; private init; }


    /// <summary>
    /// Vote card value
    /// </summary>
    public string? Value { get; private init; }


    /// <summary>
    /// Reference to image associated with this card
    /// </summary>
    public string? Image { get; private init; }


    /// <summary>
    /// Reference to card color
    /// </summary>
    public string? Color { get; private init; }


    /// <summary>
    /// Reference to card font
    /// </summary>
    public string? Font { get; private init; }


    /// <summary>
    /// Card style identifier
    /// </summary>
    public string? Style { get; private init; }


    /// <summary>
    /// Create a card entity.
    /// </summary>
    /// <param name="value">Card value</param>
    /// <param name="image">Card image</param>
    /// <param name="color">Card color</param>
    /// <param name="font">Card font</param>
    /// <param name="style">Card style</param>
    public Card(string? value, string? image, string? color, string? font, string? style)
    {
        Id = Guid.NewGuid();
        Value = value;
        Image = image;
        Color = color;
        Font = font;
        Style = style;
    }


    public override string ToString()
    {
        return $"Card (Value={Value ?? "-"})";
    }
}
