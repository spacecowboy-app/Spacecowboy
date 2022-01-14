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

import React from "react";
import { useSelector } from "react-redux";

import AppState from "../store/Store";
import Card from "./Card";

import "../screens/AvatarCreatorScreen.css";


type Props = {
    handleCardSelected: (id: string) => void;
};



/**
 * A component for presenting the card deck as a grid
 */
export default function VotePanel(props: Props): JSX.Element
{
    const deck = useSelector((state:AppState) => state.session.deck);

    if (!deck) {
        return (<> </>);
    }

    const cards = deck.cards.map((card) => (<Card key={card.id} card={card} hover={true} handleClick={handleCardClicked} />));

    return (
        <div className="verticalpanel">
            <div className="headerpanel">
                <h2>Tell the story and ask for votes...</h2>
            </div>
            <div className="cardgrid">
                {cards}
            </div>
        </div>
    );


    function handleCardClicked(id: string): void
    {
        props.handleCardSelected(id);
    }

}
