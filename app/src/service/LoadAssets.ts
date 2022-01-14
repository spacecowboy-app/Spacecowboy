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

import log from "loglevel";
import { v4 as uuidv4} from "uuid";

import { Avatar } from "../model/apptypes";
import AssetsState from "../store/AssetsState";


/**
 * Load deck and avatar themes
 */
export async function loadAssets(): Promise<AssetsState|null>
{
    log.debug("Loading assets...");
    const response = await fetch("/themes.json");

    if (response.ok) {
        const assets = convertToThemes(await response.json());
        log.debug(`Loaded ${assets.decks.length} card decks and ${assets.charms.length} charms sets`);
        return assets;
    }

    log.error("Unable to load assets");
    return null;
}


/**
 * Convert from the themes file format to the theme model.
 * @param themeDto Theme file
 * @returns Theme model
 */
function convertToThemes(themeDto: ThemesDto): AssetsState
{
    const mapAvatar = (a: string) => (new Avatar("", a));
    const mapAvatarSet = (s: AvatarSetDto) => ({...s, avatars: s.avatars.map((a) => mapAvatar(a))});
    const mapCard = (c: CardDto, font: string) => ({ ...c, id: uuidv4(), font: font });
    const mapDeck = (d: DeckDto) => ({ ...d, id: uuidv4(), cards: d.cards.map((c) => mapCard(c, d.font)), hiddenVote: mapCard(d.flipped, d.font), noVote: mapCard(d.notflipped, d.font) });

    return (
        {
            charms: themeDto.avatars.map((a) => mapAvatarSet(a)),
            decks: themeDto.decks.map((d) => mapDeck(d)),
            loading: false
        }
    );
}


interface AvatarSetDto {
    name: string;
    avatars: string[];
}

interface CardDto {
    value: string;
    color: string;
    image: string;
    style?: string;
}

interface DecktopDto {
    image: string;
}

interface DeckDto {
    name: string;
    type: string;
    font: string;
    cards: CardDto[];
    flipped: CardDto;
    notflipped: CardDto;
    decktop: DecktopDto;
}

interface ThemesDto {
    decks: DeckDto[];
    avatars: AvatarSetDto[];
}
