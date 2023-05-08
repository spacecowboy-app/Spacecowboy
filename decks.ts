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
        font: "deckfont-large",
        cards: [
            { value:"0", color: "deckmarigold", image: "hats/justhat1.png" },
            { value:"1", color: "decktangerine", image: "hats/justhat2.png" },
            { value:"2", color: "decktangerine", image: "hats/justhat3.png" },
            { value:"3", color: "decktangerine", image: "hats/justhat5.png" },
            { value:"5", color: "deckcoral", image: "hats/justhat6.png" },
            { value:"8", color: "deckcoral", image: "hats/justhat7.png" },
            { value:"13", color: "deckcoral", image: "hats/justhat9.png" },
            { value:"21", color: "deckbubblegum", image: "hats/justhat10.png" },
            { value:"34", color: "deckbubblegum", image: "hats/justhat11.png" },
            { value:"\u221e", color: "deckteal", image: "hats/justhat8.png" },
            { value:"?", color: "deckocean", image: "hats/justhat4.png" },
            { value:"Z", color: "deckjade", image: "hats/justhat12.png" }
        ],
        flipped: { color: "deckdarkgray", image: "flipped.png", style: "centered-image" },
        notflipped: { color: "decklightgray", image: "notflipped.png", style: "centered-image" },
        decktop: { image: "hats/justhat11.png" }
    }
];

export default decks;
