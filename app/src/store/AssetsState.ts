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

import { AvatarSet } from "../model/apptypes";


export default interface AssetsState {

    /** Set if the app is currently loading assets */
    readonly loading: boolean;

    /** Card decks available to the application */
    readonly decks: Deck[];

    /** Avatar charms available to the application */
    readonly charms: AvatarSet[];
}


/**
 * A card
 */
export interface Card {
    id: string;
    value: string;
    color: string;
    image: string;
    font: string;
    style?: string;
}


/**
 * A deck of cards
 */
export interface Deck {

    /** Unique deck id */
    id: string;

    /** Name of the card deck */
    name: string;

    /** Type of deck, e.g. "Fibonacci" or "Shirt" */
    type: string;

    /** All cards in the deck shown face up */
    cards: Card[];

    /** A player has selected a card but it is not yet revealed */
    hiddenVote: Card;

    /** A player has not yet selected a card */
    noVote: Card;

    /** The deck top image */
    decktop: {image: string};
}


const initialAssetsState: AssetsState = {
    loading: false,
    decks: [],
    charms: []
};


enum AssetsActionTypes {
    GET_ASSETS = "GetAssets",
    GOT_ASSETS = "GotAssets"
}


export const getAssetsAction = () =>
    ({
        type: AssetsActionTypes.GET_ASSETS
    } as const);


export const gotAssetsAction = (decks: Deck[], charms: AvatarSet[]) =>
    ({
        type: AssetsActionTypes.GOT_ASSETS,
        decks: decks,
        charms: charms
    } as const);


type AssetsActions =
    | ReturnType<typeof getAssetsAction>
    | ReturnType<typeof gotAssetsAction>;


export function assetsReducer(state = initialAssetsState, action: AssetsActions): AssetsState
{
    switch (action.type) {
        case AssetsActionTypes.GET_ASSETS: {
            return {
                ...state,
                loading: true
            };
        }
        case AssetsActionTypes.GOT_ASSETS: {
            return {
                ...state,
                loading: false,
                decks: action.decks,
                charms: action.charms
            };
        }
        default: {
            return state;
        }
    }
}