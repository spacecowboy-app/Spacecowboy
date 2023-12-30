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


namespace Spacecowboy.Service.Model.Entities
{
    /// <summary>
    /// A vote in a session
    /// </summary>
    /// <remarks>
    /// A vote is a specific Card cast by a specific Participant.
    /// </remarks>
    public class Vote
    {
        public Participant Participant { get; private set; }

        public Card Card { get; private set; }

        public Vote(Participant participant, Card card)
        {
            Participant = participant ?? throw new ArgumentNullException(nameof(participant));
            Card = card ?? throw new ArgumentNullException(nameof(card));
        }
    }
}
