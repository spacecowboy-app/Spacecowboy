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
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;

using Spacecowboy.Service.Infrastructure;
using Spacecowboy.Service.Model.Entities;
using Spacecowboy.Service.Model.Exceptions;

namespace Spacecowboy.Service.Test.Repository;

public class MemorySessionRepositoryTest
{

    [Fact]
    public async Task AddedSessionExistsInRepository()
    {
        var repo = new MemorySessionRepository(null);
        await repo.AddSessionAsync(new Session("foo-bar"));
        (await repo.SessionExistsAsync("foo-bar")).Should().BeTrue();
        (await repo.GetSessionNamesAsync()).Should().NotBeEmpty();
    }


    [Fact]
    public async Task AddedSessionCanBeDeleted()
    {
        var repo = new MemorySessionRepository(null);
        await repo.AddSessionAsync(new Session("foo-bar"));
        await repo.DeleteSessionAsync("foo-bar");
        (await repo.SessionExistsAsync("foo-bar")).Should().BeFalse();
    }


    [Fact]
    public void GetNonexistingSessionThrowsException()
    {
        var repo = new MemorySessionRepository(null);
        Action act = () => repo.GetSessionAsync("foo-bar");
        act.Should().Throw<SessionNotFoundException>();
    }


    [Fact]
    public void DeleteNonexistingSessionThrowsException()
    {
        var repo = new MemorySessionRepository(null);
        Action act = () => repo.DeleteSessionAsync("foo-bar");
        act.Should().Throw<SessionNotFoundException>();
    }
}
