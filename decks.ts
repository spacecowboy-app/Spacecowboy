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

import Deck from "@/model/Deck";


const decks: Deck[] = [
    {
        name: "Mad Hatter",
        type: "Fibonacci",
        cards: [
            { value:"0", color: "marigold", image: "hats/justhat1.png", font: "large" },
            { value:"1", color: "tangerine", image: "hats/justhat2.png", font: "large" },
            { value:"2", color: "tangerine", image: "hats/justhat3.png", font: "large" },
            { value:"3", color: "tangerine", image: "hats/justhat5.png", font: "large" },
            { value:"5", color: "coral", image: "hats/justhat6.png", font: "large" },
            { value:"8", color: "coral", image: "hats/justhat7.png", font: "large" },
            { value:"13", color: "coral", image: "hats/justhat9.png", font: "large" },
            { value:"21", color: "bubblegum", image: "hats/justhat10.png", font: "large" },
            { value:"34", color: "bubblegum", image: "hats/justhat11.png", font: "large" },
            { value:"\u221e", color: "teal", image: "hats/justhat8.png", font: "large" },
            { value:"?", color: "ocean", image: "hats/justhat4.png", font: "large" },
            { value:"Z", color: "jade", image: "hats/justhat12.png", font: "large" }
        ],
        flipped: { color: "darkgray", image: "flipped.png", style: "centered-image" },
        notflipped: { color: "lightgray", image: "notflipped.png", style: "centered-image" },
        decktop: { value: "Mad Hatter", image: "hats/justhat11.png", style: "image-value", font: "small" }
    }
];

export default decks;
