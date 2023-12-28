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
using FluentAssertions;
using Spacecowboy.Service.Controllers.DTO;
using Spacecowboy.Service.Model;
using System.Linq;
using Xunit;


namespace Spacecowboy.Service.Test
{
    public class MapperTest
    {
        readonly MapperConfiguration configuration;
        readonly IMapper mapper;


        public MapperTest()
        {
            configuration = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<Profiles>();
            });
            mapper = configuration.CreateMapper();
        }


        [Fact]
        public void Mapper_IsValidConfiguration()
        {
            configuration.AssertConfigurationIsValid();
        }


        [Fact]
        public void MapCreateCardRequestToCard()
        {
            var src = new CreateCardRequest
            {
                Value = "1",
                Image = "2",
                Color = "3",
                Font = "4",
                Style = "5"
            };
            var dest = mapper.Map<Card>(src);
            dest.Id.Should().NotBeEmpty();
            dest.Value.Should().Be("1");
            dest.Image.Should().Be("2");
            dest.Color.Should().Be("3");
            dest.Font.Should().Be("4");
            dest.Style.Should().Be("5");
        }


        [Fact]
        public void MapCreateDeckRequestToDeck()
        {
            var card1 = new CreateCardRequest { Value = "one", Image = "oneimg", Color = "onecolor", Font = "onefont", Style = "onestyle" };
            var card2 = new CreateCardRequest { Value = "two", Image = "twoimg", Color = "twocolor", Font = "twofont", Style = "twostyle" };
            var card3 = new CreateCardRequest { Value = "three", Image = "threeimg", Color = "threecolor", Font = "threefont", Style = "threestyle" };
            var novote = new CreateCardRequest { Value = "novote", Image = "novoteimg", Color = "novotecolor", Font = "novotefont", Style = "novotestyle" };
            var notrevealed = new CreateCardRequest { Value = "notrevealed", Image = "notrevealedimg", Color = "notrevealedcolor", Font = "notrevealedfont", Style = "notrevealedstyle" };

            var src = new AddDeckRequest
            {
                Name = "deckname",
                Type = "decktype",
                Cards = new CreateCardRequest[] { card1, card2, card3 },
                NoVote = novote,
                NotRevealed = notrevealed
            };
            var dest = mapper.Map<Deck>(src);

            dest.Name.Should().Be("deckname");
            dest.Type.Should().Be("decktype");
            CardsEqual(dest.NoVote, src.NoVote).Should().BeTrue();
            CardsEqual(dest.NotRevealed, src.NotRevealed).Should().BeTrue();
            dest.Cards.Count.Should().Be(3);
            dest.Cards.Where(c => c.Value == "one").Count().Should().Be(1);
            dest.Cards.Where(c => c.Image == "twoimg").Count().Should().Be(1);
            dest.Cards.Where(c => c.Color == "threecolor").Count().Should().Be(1);
        }


        private bool CardsEqual(Card card1, CreateCardRequest card2)
        {
            return (card1.Value == card2.Value
                 && card1.Image == card2.Image
                 && card1.Color == card2.Color
                 && card1.Font == card2.Font
                 && card1.Style == card2.Style);
        }
    }
}
