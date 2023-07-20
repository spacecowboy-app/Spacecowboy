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

import cn from "classnames";
import Image from "next/image";

import CardModel, { CardFont, CardStyle } from "@/model/Card";
import Constants from "@/constants";

import styles from "@/styles/Card.module.css";


interface Props {

    /** The card to render. */
    card: CardModel,

    /* If set, the card is rendered as disabled. */
    disabled?: boolean;

    /* Callback for handling clicking a card.  Passes the card id. */
    handleClick?: (id: string) => void;
}


/** Render a card. */
export default function Card(props: Props): JSX.Element
{
    // TODO Handle bug if trying to lookup a card style that is not defined here in a good way
    const deckStyles: Record<CardStyle, (c: CardModel) => JSX.Element> = {
        "value-image": CardValueAndImage,
        "image-value": CardImageAndValue,
        "centered-image": CardCenteredImage,
    };

    // TODO Handle bug if trying to lookup a card font that is not defined here in a good way
    const fontStyles: Record<CardFont, string> = {
        "small": styles.cardfontSmall,
        "large": styles.cardfontLarge,
    };

    const cardBackground = `var(--${props.card.color})`;
    const layoutFunction = props.card.style ? deckStyles[props.card.style] : CardCenteredImage;

    return (
        <div className={cn(styles.card, props.card.font && fontStyles[props.card.font])} style={ { backgroundColor: cardBackground }} onClick={() => { if (props.handleClick) props.handleClick(props.card.id); }} >
            { layoutFunction(props.card) }
        </div>
    );


    /** Render a card with a value and an image stacked vertically */
    function CardValueAndImage(card: CardModel): JSX.Element
    {
        return (
            <div className={styles.cardlayout} >
                <div className={styles.cardvalue}>{card.value}</div>
                <Image className={styles.cardimage} src={`${Constants.CardsPath}${card.image}`} width={96} height={96} alt={props.card.value ?? ""} />
            </div>
        );
    }

    /** Render a card with an image and a card stacked vertically */
    function CardImageAndValue(card: CardModel): JSX.Element
    {
        return (
            <div className={styles.cardlayout}>
                <Image className={styles.cardimage} src={`${Constants.CardsPath}${card.image}`} width={96} height={96} alt={props.card.value ?? ""} />
                <div className={styles.cardvalue}>{card.value}</div>
            </div>
        );
    }


    /** Render a card with a centered image only */
    function CardCenteredImage(card: CardModel): JSX.Element
    {
        return (
            <div className={styles.cardCenteredItem}>
                <Image className={styles.cardimage} src={`${Constants.CardsPath}${card.image}`} width={96} height={96} alt={props.card.value ?? ""} />
            </div>
        );
    }

}


