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

import React, { useState } from "react";
import { useSelector } from "react-redux";
import log from "loglevel";

import AppState from "../store/Store";
import { Deck } from "../store/AssetsState";
import Service from "../service/service";

import DeckGallery from "../component/DeckGallery";
import DeckPreview from "../component/DeckPreview";




/**
 * Presents available decks and previews of selected deck.
 */
export default function DeckSelectorScreen(): JSX.Element
{
    const decks = useSelector((state: AppState) => state.assets.decks);
    const sessionId = useSelector((state: AppState) => state.session.id);

    const [selectedDeck, setSelectedDeck] = useState<Deck|undefined>();
    const [disabledCards, setDisabledCards] = useState<string[]>([]);

    return (
        <>
            <div className="screenheader">
                <h1>select a deck</h1>
            </div>
            <DeckGallery decks={decks} selectedDeckId={selectedDeck?.id} hover={true} handleDeckSelected={(deckId) => { previewDeck(deckId); }} />
            { selectedDeck &&
                <div className="verticalpanel">
                    <h2>You can tap to modify the deck</h2>
                    <DeckPreview deck={selectedDeck} disabled={disabledCards} hover={true} cardClicked={cardClicked} />
                </div>
            }
            <div className="buttonpanel">
                <button onClick={selectDeck} className="button" disabled={!selectedDeck || disabledCards.length === selectedDeck.cards.length} >go with it</button>
            </div>
        </>
    );


    function cardClicked(cardId: string): void
    {
        const i = disabledCards.indexOf(cardId);
        if (i === -1) {
            setDisabledCards(disabledCards.concat([cardId]));
        }
        else {
            setDisabledCards(disabledCards.filter(id => id !== cardId));
        }
    }


    function previewDeck(deckId: string|undefined): void
    {
        setDisabledCards([]);
        const deck = decks.find((deck) => (deck.id === deckId));
        setSelectedDeck(deck);
    }


    function selectDeck(): void
    {
        if (selectedDeck && sessionId) {
            const cards = selectedDeck.cards.filter(c => disabledCards.indexOf(c.id) === -1);
            const deck = { ...selectedDeck, "cards": cards };
            Service.AddDeck(sessionId, deck);
            log.debug(`Selecting deck ${deck.id} for sessionInfo ${sessionId}`);
        }
    }

}
