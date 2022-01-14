/*
    Copyright 2021 Rolf Michelsen and Tami Weiss

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

import React, { useState } from "react";

import { Deck } from "../store/AssetsState";
import Card from "./Card";
import Filter from "./filter";
import "./Card.css";
import "./DeckGallery.css";


type Props = {
    /* Decks to present in the deck gallery */
    decks?: Deck[];

    /* ID of selected deck, or undefined if no deck is selected */
    selectedDeckId?: string;

    /* When true, hovered cards will be highlighted */
    hover?: boolean;

    /* Callback for when a deck is selected */
    handleDeckSelected?: (id: string|undefined) => void;
};


/**
 * Presents all available card decks
 */
export default function DeckGallery(props: Props): JSX.Element
{
    const deckCategories = ["All", ...Array.from(new Set(props.decks?.map((d) => d.type)))];

    const [decktypeindex, setDecktypeindex] = useState<number>(0);

    if (!props.decks) {
        return (<div>No deck available</div>);
    }

    return (
        <div>
            {props.handleDeckSelected && <Filter options={deckCategories} selected={decktypeindex}  selectOption={selectDecktype} />}
            <div className="cardgallery">
                {props.decks
                    .filter((d) => (decktypeindex === 0 || deckCategories[decktypeindex].toLowerCase() === d.type.toLowerCase()))
                    .map((d) => (
                        <Card card={{
                            "id":d.id,
                            "value":d.name.toLowerCase(),
                            "color":(d.id === props.selectedDeckId ? "decktopselected" : "decktop"),
                            "image":d.decktop.image,
                            "font":"deckfont-small",
                            "style": "image-value"}}
                        hover={props.hover}
                        key={d.id}
                        handleClick={() => props.handleDeckSelected && props.handleDeckSelected(d.id)} />
                    ))}
            </div>
        </div>
    );


    function selectDecktype(i: number): void
    {
        setDecktypeindex(i);
        if (props.handleDeckSelected) {
            props.handleDeckSelected(undefined);
        }
    }
}
