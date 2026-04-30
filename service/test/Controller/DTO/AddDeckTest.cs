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
using System.Linq;
using Xunit;

using Spacecowboy.Service.Controllers.DTO;
using Spacecowboy.Service.Model.Entities;

namespace Spacecowboy.Service.Test.Controller.DTO;

public class AddDeckTest
{
    [Fact]
    public void AddDeckRequest_To_Deck()
    {
        var request = new AddDeckRequest
        {
            Name = "Test Deck",
            Type = "Test Type",
            Cards = new CreateCardRequest[]
            {
                new CreateCardRequest
                {
                    Value = "Card 1",
                    Image = "Image 1",
                    Color = "Color 1",
                    Font = "Font 1",
                    Style = "Style 1"
                },
                new CreateCardRequest
                {
                    Value = "Card 2",
                    Image = "Image 2",
                    Color = "Color 2",
                    Font = "Font 2",
                    Style = "Style 2"
                }
            },
            NoVote = new CreateCardRequest
            {
                Value = "No Vote",
                Image = "No Vote Image",
                Color = "No Vote Color",
                Font = "No Vote Font",
                Style = "No Vote Style"
            },
            NotRevealed = new CreateCardRequest
            {
                Value = "Not Revealed",
                Image = "Not Revealed Image",
                Color = "Not Revealed Color",
                Font = "Not Revealed Font",
                Style = "Not Revealed Style"
            }
        };

        Deck deck = (Deck) request;

        Assert.Equal(request.Name, deck.Name);
        Assert.Equal(request.Type, deck.Type);
        Assert.Equal(request.Cards.Length, deck.Cards.Count);

        var cardArray = deck.Cards.ToArray();
        for (int i = 0; i < request.Cards.Length; i++)
        {
            Assert.Equal(request.Cards[i].Value, cardArray[i].Value);
            Assert.Equal(request.Cards[i].Image, cardArray[i].Image);
            Assert.Equal(request.Cards[i].Color, cardArray[i].Color);
            Assert.Equal(request.Cards[i].Font, cardArray[i].Font);
            Assert.Equal(request.Cards[i].Style, cardArray[i].Style);
        }

        Assert.Equal(request.NoVote.Value, deck.NoVote.Value);
        Assert.Equal(request.NoVote.Image, deck.NoVote.Image);
        Assert.Equal(request.NoVote.Color, deck.NoVote.Color);
        Assert.Equal(request.NoVote.Font, deck.NoVote.Font);
        Assert.Equal(request.NoVote.Style, deck.NoVote.Style);
        Assert.Equal(request.NotRevealed.Value, deck.NotRevealed.Value);
        Assert.Equal(request.NotRevealed.Image, deck.NotRevealed.Image);
        Assert.Equal(request.NotRevealed.Color, deck.NotRevealed.Color);
        Assert.Equal(request.NotRevealed.Font, deck.NotRevealed.Font);
        Assert.Equal(request.NotRevealed.Style, deck.NotRevealed.Style);
    }
}
