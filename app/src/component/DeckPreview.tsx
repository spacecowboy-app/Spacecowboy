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

import React from "react";

import Card from "./Card";
import { Deck } from "../store/AssetsState";

import "./DeckPreview.css";



interface Props {

    /* Deck to be previewed */
    deck: Deck;

    /* ID of all cards that are to be marked as disabled in the deck */
    disabled?: string[];

    /* When set, the hovered card will be highlighted */
    hover?: boolean;

    /* Callback for handling a click on a card */
    cardClicked?: (id: string) => void;
}


/**
 * Show a preview of a card deck
 */
export default function DeckPreview(props: Props): JSX.Element
{
    return (
        <div className="deckpreview">
            {props.deck.cards.map((card) => (
                <Card key={card.id} card={card} disabled={props.disabled?.find(id => id === card.id) !== undefined} hover={props.hover} handleClick={props.cardClicked} />
            ))}
        </div>
    );
}
