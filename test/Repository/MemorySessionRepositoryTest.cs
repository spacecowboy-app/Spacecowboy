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
using System.Threading.Tasks;
using AutoMapper;
using FluentAssertions;
using Spacecowboy.Service.Infrastructure;
using Spacecowboy.Service.Infrastructure.DTO;
using Spacecowboy.Service.Model.Entities;
using Spacecowboy.Service.Model.Exceptions;
using Xunit;


namespace Spacecowboy.Service.Test.Repository
{
    public class MemorySessionRepositoryTest
    {
        private readonly IMapper mapper;

        public MemorySessionRepositoryTest()
        {
            var mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<RepositoryProfiles>();
            });
            mapper = mapperConfig.CreateMapper();
        }


        [Fact]
        public async Task NewRepositoryContainsNoSessions()
        {
            var repo = new MemorySessionRepository(null, mapper);
            var sessions = await repo.GetSessionNamesAsync();
            sessions.Should().BeEmpty();
        }


        [Fact]
        public async Task AddedSessionExistsInRepository()
        {
            var repo = new MemorySessionRepository(null, mapper);
            await repo.AddSessionAsync(new Session("foo-bar"));
            (await repo.SessionExistsAsync("foo-bar")).Should().BeTrue();
            (await repo.GetSessionNamesAsync()).Should().NotBeEmpty();
        }


        [Fact]
        public async Task AddedSessionCanBeDeleted()
        {
            var repo = new MemorySessionRepository(null, mapper);
            await repo.AddSessionAsync(new Session("foo-bar"));
            await repo.DeleteSessionAsync("foo-bar");
            (await repo.SessionExistsAsync("foo-bar")).Should().BeFalse();
        }


        [Fact]
        public void GetNonexistingSessionThrowsException()
        {
            var repo = new MemorySessionRepository(null, mapper);
            Action act = () => repo.GetSessionAsync("foo-bar");
            act.Should().Throw<SessionNotFoundException>();
        }


        [Fact]
        public void DeleteNonexistingSessionThrowsException()
        {
            var repo = new MemorySessionRepository(null, mapper);
            Action act = () => repo.DeleteSessionAsync("foo-bar");
            act.Should().Throw<SessionNotFoundException>();
        }
    }
}

