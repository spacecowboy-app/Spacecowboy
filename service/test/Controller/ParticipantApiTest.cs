/*
    Copyright 2021 Rolf Michelsen and Tami Weiss

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

using Xunit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Spacecowboy.Service.Controllers;
using Spacecowboy.Service.Controllers.DTO;
using Spacecowboy.Service.Controllers.DTO.Errors;
using Spacecowboy.Service.Infrastructure;
using Spacecowboy.Service.Infrastructure.DTO;
using Spacecowboy.Service.Model;


namespace Spacecowboy.Service.Test.Controller
{
    public class ParticipantApiTest
    {
        private const string SessionName = "foo-bar";

        private readonly ISessionRepository repository;
        private readonly SessionController controller;
        private readonly ILogger<SessionController> logger;
        private readonly IMapper mapper;


        public ParticipantApiTest()
        {
            using var loggerFactory = LoggerFactory.Create(builder =>
            {
                builder
                    .AddConsole();
            });
            logger = loggerFactory.CreateLogger<SessionController>();

            var mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<Profiles>();
                cfg.AddProfile<RepositoryProfiles>();
            });
            mapper = mapperConfig.CreateMapper();

            repository = new MemorySessionRepository(null, mapper);

            var options = new ServiceOptions();

            controller = new SessionController(logger, repository, mapper, Options.Create<ServiceOptions>(options), null);
        }


        [Fact]
        public async Task AddParticipant()
        {
            // Create session
            var sessionResponse = await controller.CreateSession(SessionName);
            var sessionResult = sessionResponse.Result as ObjectResult;
            sessionResult.StatusCode.Should().Be(201);

            // Add deck
            await controller.AddDeck(SessionName, new AddDeckRequest
            {
                Name = "foo-deck",
                Type = "foo-type",
                NoVote = new CreateCardRequest { Value = "novote" },
                NotRevealed = new CreateCardRequest { Value = "notrevealed" },
                Cards = new CreateCardRequest[] { new CreateCardRequest { Value = "1" } }
            });

            // Add participant
            var participantResponse = await controller.AddParticipant(SessionName, new CreateParticipantRequest { Name = "inky", Avatar = "inky-avatar", Color = "inky-color" });
            var participantResult = participantResponse.Result as ObjectResult;
            participantResult.StatusCode.Should().Be(200);

        }


        [Fact]
        public async Task AddParticipantWithoutColor()
        {
            // Create session
            var sessionResponse = await controller.CreateSession(SessionName);
            var sessionResult = sessionResponse.Result as ObjectResult;
            sessionResult.StatusCode.Should().Be(201);

            // Add deck
            await controller.AddDeck(SessionName, new AddDeckRequest
            {
                Name = "foo-deck",
                Type = "foo-type",
                NoVote = new CreateCardRequest { Value = "novote" },
                NotRevealed = new CreateCardRequest { Value = "notrevealed" },
                Cards = new CreateCardRequest[] { new CreateCardRequest { Value = "1" } }
            });

            // Add participant
            var participantResponse = await controller.AddParticipant(SessionName, new CreateParticipantRequest { Name = "inky", Avatar = "inky-avatar" });
            var participantResult = participantResponse.Result as ObjectResult;
            participantResult.StatusCode.Should().Be(200);

        }


        [Fact]
        public async Task AddParticipantWithoutAvatar()
        {
            // Create session
            var sessionResponse = await controller.CreateSession(SessionName);
            var sessionResult = sessionResponse.Result as ObjectResult;
            sessionResult.StatusCode.Should().Be(201);

            // Add deck
            await controller.AddDeck(SessionName, new AddDeckRequest
            {
                Name = "foo-deck",
                Type = "foo-type",
                NoVote = new CreateCardRequest { Value = "novote" },
                NotRevealed = new CreateCardRequest { Value = "notrevealed" },
                Cards = new CreateCardRequest[] { new CreateCardRequest { Value = "1" } }
            });

            // Add participant
            var participantResponse = await controller.AddParticipant(SessionName, new CreateParticipantRequest { Name = "inky", Color = "inky-color" });
            var participantResult = participantResponse.Result as ObjectResult;
            participantResult.StatusCode.Should().Be(200);

        }


        [Fact]
        public async Task AddParticipantWithoutNameReturnsBadRequest()
        {
            // Create session
            var sessionResponse = await controller.CreateSession(SessionName);
            var sessionResult = sessionResponse.Result as ObjectResult;
            sessionResult.StatusCode.Should().Be(201);

            // Add deck
            await controller.AddDeck(SessionName, new AddDeckRequest
            {
                Name = "foo-deck",
                Type = "foo-type",
                NoVote = new CreateCardRequest { Value = "novote" },
                NotRevealed = new CreateCardRequest { Value = "notrevealed" },
                Cards = new CreateCardRequest[] { new CreateCardRequest { Value = "1" } }
            });

            // Add participant
            var participantResponse = await controller.AddParticipant(SessionName, new CreateParticipantRequest { Avatar = "inky-avatar", Color = "inky-color" });
            var participantResult = participantResponse.Result as ObjectResult;
            participantResult.StatusCode.Should().Be(400);

        }

    }
}
