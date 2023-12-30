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
    /// A participant in a session
    /// </summary>
    public class Participant : IEquatable<Participant>
    {
        /// <summary>
        /// Participant identifier
        /// </summary>
        /// <remarks>
        /// The service generates the participant identifier.  It is guaranteed to be globally unique.
        /// </remarks>
        public Guid Id { get; private set; }

        /// <summary>
        /// Participant name
        /// </summary>
        /// <remarks>
        /// The service does not use this property for anything. It is intended for the client to use to store the publically
        /// displayed nick or name associated with the participant.
        /// </remarks>
        public string Name { get; }

        /// <summary>
        /// Avatar reference
        /// </summary>
        /// <remarks>
        /// The service does not use this property for anything. It is intended for the client to use as a reference to
        /// the participant's avatar.  It is up to the client to define the format of this reference.
        /// </remarks>
        public string? Avatar { get; }

        /// <summary>
        /// Avatar color
        /// </summary>
        public string? Color { get; }

        /// <summary>
        /// The time this participant was last active
        /// </summary>
        public DateTime LastActive { get; private set; }

        /// <summary>
        /// Return the participant idle time (in seconds)
        /// </summary>
        public double Idle { get => (DateTime.UtcNow - LastActive).TotalSeconds; }

        /// <summary>
        /// Create a Participant
        /// </summary>
        /// <param name="name">Participant's name or nick (mandatory)</param>
        /// <param name="avatar">Participant's avatar reference (optional)</param>
        /// <param name="color">Participant's avatar color</param>
        public Participant(string name, string? avatar, string? color)
        {
            Id = Guid.NewGuid();
            Name = name;
            Avatar = avatar;
            Color = color;
            LastActive = DateTime.UtcNow;
        }


        public override bool Equals(object? other)
        {
            if (!(other is Participant)) return false;
            return Equals((Participant) other);
        }

        public bool Equals(Participant? other)
        {
            return Id.Equals(other?.Id);
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }

        public override string ToString()
        {
            return $"Participant (Id=\"{Id}\" Name=\"{Name}\" Avatar=\"{Avatar ?? ""}\" Color=\"{Color ?? ""}\")";
        }
    }
}
