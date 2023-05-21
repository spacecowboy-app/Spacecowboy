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

import Card, { CardFont, CardStyle } from "../../model/Card";
import ModelMappingException from "./ModelMappingException";


/** Card object as returned by the service REST API. */
export default interface CardResponse {
    id: string,
    value?: string,
    image?: string,
    color?: string,
    font?: string,
    style?: string,
}


export function MapFromCardResponse(response: CardResponse): Card {
    return ({
        id: response.id,
        value: response.value,
        image: response.image,
        color: response.color,
        font: asCardFont(response.font),
        style: asCardStyle(response.style),
    });
}


// TODO can this be done better?
function asCardFont(a?: string): CardFont|undefined {
    const validFonts = [ "large", "small" ];
    if (a) {
        if (validFonts.includes(a)) {
            return a as CardFont;
        }
        throw new ModelMappingException(`Received an unexpected card font "${a}"`);
    }
    return undefined;
}


function asCardStyle(a?: string): CardStyle|undefined {
    const validStyles = [ "value-image", "image-value", "centered-image" ];
    if (a) {
        if (validStyles.includes(a)) {
            return a as CardStyle;
        }
        throw new ModelMappingException(`Received an unexpected card style "${a}"`);
    }
    return undefined;
}
