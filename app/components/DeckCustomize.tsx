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

import React, { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import DeckGallery from "./DeckGallery";
import Card from "@/model/Card";
import Deck from "@/model/Deck";


interface Props {

    /** Deck to be customized. */
    deck: Deck;

    /** Callback when a deck is customized. Passes the customized deck. */
    deckCustomized: (deck: Deck) => void;

    /** Callback when the player wants to go back to deck selection. */
    deckReselect?: () => void;
};



/**
 * Component to allow customization of a deck.  Tap a card to exclude or include a given card in the deck.
 */
export default function DeckCustomize(props: Props): JSX.Element
{
    const [cards, setCards] = useState<Card[]>(props.deck.cards.map(c => ({...c, isDisabled: false})));
    const allCardsDisabled: boolean = !cards.some(c => !c.isDisabled);

    return (
        <Box>
            <Stack spacing={2} alignItems="center">
                <Typography variant="h1">customize cards</Typography>
                <Typography variant="h3">Tap a card to modify the deck</Typography>
                <DeckGallery cards={cards} selectCard={toggleCard} />
                <Stack spacing={2} direction="row">
                    { props.deckReselect && <Button variant="contained" onClick={props.deckReselect} >back to decks</Button> }
                    <Button variant="contained" onClick={selectCards} disabled={allCardsDisabled} >go with it</Button>
                </Stack>
            </Stack>
        </Box>
    );


    /**
     * Callback toggling the enabled state of the identified card.
     * @param {string} cardId Card id.
     * */
    function toggleCard(cardId: string): void
    {
        setCards(cards.map(c => c.id == cardId ? {...c, isDisabled: !c.isDisabled} : c));
    }


    /** Callback returning a deck containing only the enabled cards from that deck. */
    function selectCards(): void
    {
        props.deckCustomized({...props.deck, cards: cards.filter(c => !c.isDisabled).map(c => c as Card)});
    }
}
