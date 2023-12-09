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


namespace Spacecowboy.Service
{
    /// <summary>
    /// Service configuration options.
    /// </summary>
    public record ServiceOptions
    {
        public const string Service = "Spacecowboy";

        /// <summary>
        /// Session repository type
        /// </summary>
        /// <remarks>
        /// Valid values are "redis" and "memory".
        /// </remarks>
        public string? RepositoryType { get; init; }

        /// <summary>
        /// Name of this instance of the service.  Each running instance has a unique name.
        /// Defaults to the hostname.
        /// </summary>
        public string? InstanceName { get; init; } = Environment.GetEnvironmentVariable("HOSTNAME");
    }
}
