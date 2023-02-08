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
    /// Generate a random session name
    /// </summary>
    /// <remarks>
    /// The generated session name is short and readable.  This class makes no guarantee that the session name is actually available for use.
    /// </remarks>
    public class GenerateSessionName
    {
        private static readonly string[] descriptions = { 
            "lovely", "gloomy", "happy", "boring", "exciting", "adventurous", "moody", "scary", 
            "caring", "noisy", "quiet", "crowded", "lonely", "romantic", "cold", "hot", "misty", "faraway"
         };

        private static readonly string[] places =
        {
            "town", "chaparral", "saloon", "graveyard", "barn", "prairie", "mountain", "goldmine", "lodge",
            "galaxy", "planet", "moon", "comet", "star", "infinity", "wormhole", "singularity", "sun", "supernova"
        };

        private static Random random = new Random();


        /// <summary>
        /// Generate a random session name
        /// </summary>
        /// <returns>Session name</returns>
        public static string getName()
        {
            var i = (int) (random.NextDouble() * descriptions.Length);
            int j = (int) (random.NextDouble() * places.Length);
            return descriptions[i] + "-" + places[j];
        }
    }
}
