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

import Deck from "@/model/Deck";
import DeckCategoryFilter from "./model/DeckCategoryFilter";
import DecksCollection from "./model/DecksCollection";


const decks: Deck[] = [
    {
        id: "901c8c95-c4cd-43dc-9341-1fe076443307",
        name: "Mad Hatter",
        type: "Fibonacci",
        cards: [
            { id: "a05d9622-e9c8-48b3-9ccf-697ffeecc2b3", value:"0", color: "marigold", image: "hats/justhat1.png", font: "large", style: "value-image" },
            { id: "a891f018-ddd1-4445-a36a-a90c1a3115c4", value:"1", color: "tangerine", image: "hats/justhat2.png", font: "large", style: "value-image" },
            { id: "cd0657ae-a2c2-443b-aa17-4f6003b4eb5a", value:"2", color: "tangerine", image: "hats/justhat3.png", font: "large", style: "value-image" },
            { id: "9e36b375-28bc-403b-b62d-c9d53cfc9a92", value:"3", color: "tangerine", image: "hats/justhat5.png", font: "large", style: "value-image" },
            { id: "0a3604fe-daee-4d01-8c2f-e07907db82fb", value:"5", color: "coral", image: "hats/justhat6.png", font: "large", style: "value-image" },
            { id: "a8012856-eec5-455a-b00e-f314bb38db13", value:"8", color: "coral", image: "hats/justhat7.png", font: "large", style: "value-image" },
            { id: "a3ccf456-4004-4a65-9ff7-19fc8da3f25f", value:"13", color: "coral", image: "hats/justhat9.png", font: "large", style: "value-image" },
            { id: "e3976e52-ad83-46db-8610-43ca3726ff0a", value:"21", color: "bubblegum", image: "hats/justhat10.png", font: "large", style: "value-image" },
            { id: "80749d80-518f-4222-9fbc-faad37d3a914", value:"34", color: "bubblegum", image: "hats/justhat11.png", font: "large", style: "value-image" },
            { id: "f3d9b640-89c0-4f10-8359-8bb13f91d53e", value:"\u221e", color: "teal", image: "hats/justhat8.png", font: "large", style: "value-image" },
            { id: "0c9a5189-e9da-42c3-96d4-6c218fd4a1a5", value:"?", color: "ocean", image: "hats/justhat4.png", font: "large", style: "value-image" },
            { id: "a8a79250-ce39-4b12-af8a-6975077b86e4", value:"break", color: "jade", image: "hats/justhat12.png", font: "small", style: "value-image" }
        ],
        flipped: { id: "38d19b0d-ab9b-493c-9385-fef84cbd4b62", color: "darkgray", image: "flipped.png", style: "centered-image" },
        notflipped: { id: "a1b35a4a-2176-4638-a128-0e0245970f98", color: "lightgray", image: "notflipped.png", style: "centered-image" },
        decktop: { id: "3e203b85-a0ab-42cd-bcda-157621ee98ab", value: "Mad Hatter", color: "decktop", image: "hats/justhat11.png", style: "image-value", font: "small" },
        noVote: { id: "8be2c13b-9ddb-434e-960f-c1de485b8934" },
        hiddenVote: { id: "d10ca582-feec-41c9-8888-c34f0e54f381" },
    }
];


const deckFilters: DeckCategoryFilter[] = [
    {
        name: "All",
        decks: [ "901c8c95-c4cd-43dc-9341-1fe076443307" ]
    },
    {
        name: "Fibonacci",
        decks: [ "901c8c95-c4cd-43dc-9341-1fe076443307" ]
    }
];


const decksCollection: DecksCollection = {
    decks: decks,
    deckFilters: deckFilters,
}


export default decksCollection;
