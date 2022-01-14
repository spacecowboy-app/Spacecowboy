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
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Deck } from "../store/AssetsState";
import AppState from "../store/Store";

import DeckGallery from "../component/DeckGallery";
import DeckPreview from "../component/DeckPreview";

import "./AboutScreen.css";



/**
 * A screen showing the deck gallery and a brief text.
 */
export default function DeckGalleryScreen(): JSX.Element
{
    const decks = useSelector((state: AppState) => state.assets.decks);

    const [selectedDeck, setSelectedDeck] = useState<Deck|undefined>();

    return (
        <>
            <div className="aboutvertical lightcontainer">
                <h1 className="abouttext">deck gallery</h1>
                <p className="abouttext">You can use the decks for planning poker or for asking for feedback from your team.
                    Select a type or deck to view the cards. You can customize the deck by tapping the cards.</p>
            </div>
            <div className="aboutvertical shadedcontainer">
                <h2 className="abouttext">deck types</h2>
                <p className="abouttext">Fibonacci and shirt decks can be used to estimate cost or effort.
                    These decks also include cards to represent very big or uncertain estimates.
                    The clever decks support other kinds of decisions. Many decks have a card that can
                    be used to suggest a break. All decks can be customized by removing cards that are
                    not needed.</p>
            </div>
            <div className="aboutvertical lightcontainer">
                <DeckGallery decks={decks} selectedDeckId={selectedDeck?.id} hover={true} handleDeckSelected={handleSelectDeck} />
                { selectedDeck &&
                    <>
                        <h2>{selectedDeck.name}</h2>
                        { selectedDeck.name === "High Noon" && <p className="abouttext">Estimate the effort or cost of a project using a relative mesure</p> }
                        { selectedDeck.name === "Agree?" && <p className="abouttext">Assess level of agreement with a statement using a Likert scale</p> }
                        <DeckPreview deck={selectedDeck} hover={true} />
                    </>
                }
            </div>
            <div className="aboutvertical lightcontainer">
                <h1>ready to play?</h1>
            </div>
            <div className="buttonpanel">
                <Link to="/start" className="button">start a showdown</Link>
            </div>
        </>
    );


    function handleSelectDeck(deckId: string|undefined): void
    {
        if (decks) {
            const deck = decks.find((deck) => (deck.id === deckId));
            setSelectedDeck(deck);
        }
    }

}
