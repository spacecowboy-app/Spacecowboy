/*
    Copyright 2021-2026 Rolf Michelsen and Tami Weiss

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

import Grid from '@mui/material/Unstable_Grid2';

import Card from "./Card";
import CardModel from "@/model/Card";


interface Props {

    /** Cards to show in the gallery. */
    cards: CardModel[],

    /** Callback handling selection of a specific card.  The parameter is the selected card id. */
    selectCard?: (id: string) => void
};


/**
 * Presents a set of cards.
 */
export default function DeckGallery(props: Props): JSX.Element
{
    return (
        <Grid container spacing={2} justifyContent="center" >
            { props.cards.map(c => <Card key={c.id} card={c} handleClick={() => { if (props.selectCard) props.selectCard(c.id); }} /> ) }
        </Grid>
    );
}
