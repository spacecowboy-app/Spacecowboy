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
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Spacecowboy.Service.Model.Entities;
using Xunit;


namespace Spacecowboy.Service.Test.Model
{
    public class SessionTest
    {
        [Fact]
        public void Create_ReturnsEmptySession()
        {
            var session = new Session("foo-bar");
            session.Id.Should().Be("foo-bar");
            session.CreateTime.Should().BeOnOrBefore(DateTime.UtcNow);
            session.GetParticipants().Should().BeEmpty();
        }


        [Fact]
        public void Create_EmptySessionName_ThrowsException()
        {
            Action act = () => new Session(" ");
            act.Should().Throw<ArgumentException>();
        }

        [Theory]
        [InlineData("foo-bar")]
        [InlineData("foo")]
        [InlineData("a")]
        [InlineData("0-0")]
        public void SessionId_Valid(string id)
        {
            Session.IsValidId(id).Should().BeTrue();
        }


        [Theory]
        [InlineData("/foobar")]
        [InlineData("foo/bar")]
        [InlineData("foo&bar")]
        public void SessionId_Invalid(string id)
        {
            Session.IsValidId(id).Should().BeFalse();
        }


        [Fact]
        public void Participant_IdleTime_ShouldIncrease()
        {
            var session = new Session("foo-bar");
            var participant = new Participant("clyde", "avatar", "color");
            session.AddParticipant(participant);

            var idle1 = FindParticipant(session.GetParticipants(), participant.Id).Idle;
            var idle2 = FindParticipant(session.GetParticipants(), participant.Id).Idle;

            idle1.Should().BeLessThan((double)idle2);
        }



        private static Participant FindParticipant(IEnumerable<Participant> participants, Guid id)
        {
            var found = participants.Where(p => (p.Id == id));
            if (found.Count() != 1)
                throw new Exception($"Expected to find exactly one participant but found {found.Count()}");
            return found.First();
        }
    }
}
