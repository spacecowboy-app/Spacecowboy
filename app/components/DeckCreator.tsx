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

import React, { useEffect, useState } from "react";

import log from "loglevel";

import DeckCustomize from "./DeckCustomize";
import DeckSelector from "./DeckSelector";
import Deck from "@/model/Deck";
import DeckCategoryFilter from "@/model/DeckCategoryFilter";
import { getDecksAsync } from "@/service/Service";


interface Props {
    /** Callback for creating a deck. */
    deckCreated?: (deck: Deck) => void,
}


// TODO Add function documentation
export default function DeckCreator(props: Props): JSX.Element
{
    const [decks, setDecks] = useState<Deck[]|undefined>();     // All available decks
    const [deckFilters, setDeckFilters] = useState<DeckCategoryFilter[]|undefined>();       // deck category filters
    const [selectedDeck, setSelectedDeck] = useState<Deck|undefined>();                                 // currently selected deck

    /* Get all available decks. */
    useEffect(() => {
        if (!decks) {
            getDecksAsync()
                .then(result => {
                    setDecks(result.decks);
                    setDeckFilters(result.deckFilters);
                    log.debug(`Got ${result.decks.length} decks.`);
                })
                .catch(() => log.error("Unable to get any decks."));
        }
    }, [decks]);

    if (!decks || decks.length === 0) {
        return (<></>);
    }

    /* If no deck has been selected, show all decks and let the player select a deck. */
    if (!selectedDeck) {
        return (
            <DeckSelector decks={decks} deckFilters={deckFilters} deckSelected={(id) => selectDeck(id)} />
        );
    }

    /* A deck has been selected.  Show the deck cards and allow for customization. */
    return (
        <DeckCustomize
            deck={selectedDeck}
            deckCustomized={(deck) => props.deckCreated && props.deckCreated(deck)}
            deckReselect={() => setSelectedDeck(undefined)}
        />
    );


    /** Callback handling the player selecting a deck by clicking on it. */
    function selectDeck(decktopId: string): void
    {
        const deck = decks?.find(d => d.decktop.id == decktopId);
        if (deck) {
            setSelectedDeck(deck);
            log.info(`Selected deck ${deck.name}`);
        }
        else {
            log.error(`Selected deck that is not available, decktop id = ${decktopId}`);
        }
    }

}
