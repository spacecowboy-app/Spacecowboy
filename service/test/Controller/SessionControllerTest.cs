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
using System;
using System.Threading.Tasks;
using Xunit;


namespace Spacecowboy.Service.Test.Controller
{
    public class SessionControllerTest
    {
        private readonly ISessionRepository repository;
        private readonly SessionController controller;
        private readonly ILogger<SessionController> logger;
        private readonly IMapper mapper;


        public SessionControllerTest()
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
        public async Task GetSessionsReturnsEmptyList()
        {
            var result = await controller.GetSessions();

            result.Should().BeOfType<ActionResult<SessionsSummary>>();
            result.Result.Should().BeOfType<OkObjectResult>();

            var ok = result.Result as OkObjectResult;
            var value = ok.Value as SessionsSummary;
            value.ActiveSessions.Should().Be(0);
        }


        [Fact]
        public async Task CreateSessionWithIdOnly()
        {
            var response = await controller.CreateSession("foo-bar");

            response.Should().BeOfType<ActionResult<SessionResponse>>();
            var result = response.Result as ObjectResult;

            result.StatusCode.Should().Be(201);
            result.Value.Should().BeOfType<SessionResponse>();

            var session = result.Value as SessionResponse;
            session.Id.Should().Be("foo-bar");
            session.Participants.Should().BeNullOrEmpty();
            session.Cards.Should().BeNullOrEmpty();
            session.NoVote.Should().BeNull();
            session.NotRevealed.Should().BeNull();
        }



        [Fact]
        public async Task CreateSessionWithInvalidName()
        {
            var response = await controller.CreateSession("foo@bar");
            var result = response.Result as ObjectResult;

            result.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
            result.Value.Should().BeOfType<BadRequestErrorDetails>();
            var error = result.Value as ErrorDetails;
            error.Status.Should().Be(StatusCodes.Status400BadRequest);
            error.SessionId.Should().Be("foo@bar");
        }



        [Fact]
        public async Task CreateSessionThatAlreadyExists()
        {
            await controller.CreateSession("foo-bar");
            var response = await controller.CreateSession("foo-bar");
            var result = response.Result as ObjectResult;

            result.StatusCode.Should().Be(StatusCodes.Status409Conflict);
            result.Value.Should().BeOfType<ConflictErrorDetails>();
            var error = result.Value as ErrorDetails;
            error.Status.Should().Be(StatusCodes.Status409Conflict);
            error.SessionId.Should().Be("foo-bar");
        }


        [Fact]
        public async Task RemoveNonexistingParticipant()
        {
            var participantId = Guid.NewGuid();
            var sessionId = "foo-bar";
            await controller.CreateSession(sessionId);

            var response = await controller.RemoveParticipant(sessionId, participantId);
            var result = response.Result as ObjectResult;

            result.StatusCode.Should().Be(StatusCodes.Status404NotFound);
            result.Value.Should().BeOfType<NotFoundErrorDetails>();
            var error = result.Value as ErrorDetails;
            error.Status.Should().Be(StatusCodes.Status404NotFound);
            error.SessionId.Should().Be("foo-bar");
            error.ParticipantId.Should().Be(participantId);
        }

    }
}
