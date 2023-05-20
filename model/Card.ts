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

// TODO Describe the different card styles here.
export type CardStyle = "value-image" | "image-value" | "centered-image";

// Card font settings, must correspond to a CSS class.
export type CardFont = "small" | "large";


/** A single card. */
export default interface Card {
    /** Card identifier (uuid). */
    id: string,

    value?: string,

    /** Color must be a color name defined as a CSS variable. */
    color?: string,

    /** An image path relative to Constants.CardsPath. */
    image: string,

    style?: CardStyle,

    font?: CardFont,
}
