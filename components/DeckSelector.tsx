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

import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MenuItem } from "@mui/material";

import Deck from "@/model/Deck";
import DeckCategoryFilter from "@/model/DeckCategoryFilter";
import DeckGallery from "@/components/DeckGallery";


interface Props {

    /** All available decks. */
    decks: Deck[];

    /** Deck category filters. */
    deckFilters?: DeckCategoryFilter[];

    /** Callback when a deck is selected.  Passes the deck id. */
    deckSelected: (id: string)=> void;
};


/**
 * Component to select one of several decks.
 * @param props Component properties
 */
export default function DeckSelector(props: Props): JSX.Element
{
    const [selectedDeckCategory, setSelectedDeckCategory] = useState<DeckCategoryFilter|undefined>(props.deckFilters ? props.deckFilters[0] : undefined);   // currently selected deck type

    return (
        <Box>
            <Stack spacing={2} alignItems="center">
                <Typography variant="h1">select deck</Typography>
                { props.deckFilters && selectedDeckCategory &&
                    <Select value={selectedDeckCategory.name} onChange={(e) => { setSelectedDeckCategory(props.deckFilters!.find(f => f.name == (e.target.value as string))); }}>
                        { props.deckFilters.map(d => <MenuItem key={d.name} value={d.name}>{d.name}</MenuItem>) }
                    </Select>
                }
                <DeckGallery cards={props.decks.filter(d => !selectedDeckCategory || selectedDeckCategory.decks.some(id => id == d.id)).map(d => d.decktop)} selectCard={(id) => props.deckSelected(id)} />
            </Stack>
        </Box>
    );
}
