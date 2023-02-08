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

import React from "react";

import Constants from "../Constants";
import {Card as CardModel} from "../store/AssetsState";

import "./Card.css";


interface Props  {

    /* Information about the card to render */
    card: CardModel;

    /* If set, the card is rendered as disabled */
    disabled?: boolean;

    /* If set, special styling is applied on hovering over a card */
    hover?: boolean;

    /* Callback for handling clicking a card */
    handleClick?: (id: string) => void;
}


/**
 * Component representing a voting card.
 */
export default function Card(props: Props): JSX.Element
{
    const styles = [
        {style: "value-image", render: CardValueAndImage},
        {style: "image-value", render: CardImageAndValue},
        {style: "centered-image", render: CardCenteredImage}
    ];

    const styling = styles.reduce((result, item) => (item.style === props.card.style ? item.render : result) , CardValueAndImage);

    return(
        <div className={`card ${props.disabled === true ? "carddisabled" : ""} ${props.card.color} ${props.hover === true ? "cardhover" : ""}`} onClick={(): void => handleClick(props.card.id)} >
            { styling(props.card) }
        </div>
    );


    function handleClick(id: string|undefined = undefined): void
    {
        if (id && props.handleClick) {
            props.handleClick(id);
        }
    }



    /** Render a card with a value and an image stacked vertically */
    function CardValueAndImage(card: CardModel): JSX.Element
    {
        return (
            <div className="cardlayout">
                <div className={`cardvalue ${card.font}`}>{card.value}</div>
                <img className="cardimage" src={`${Constants.CardsPath}${card.image}`} alt={props.card.value} />
            </div>
        );
    }


    /** Render a card with an image and a card stacked vertically */
    function CardImageAndValue(card: CardModel): JSX.Element
    {
        return (
            <div className="cardlayout">
                <img className="cardimage" src={`${Constants.CardsPath}${card.image}`} alt={props.card.value} />
                <div className={`cardvalue ${card.font}`}>{card.value}</div>
            </div>
        );
    }


    /** Render a card with a centered image only */
    function CardCenteredImage(card: CardModel): JSX.Element
    {
        return (
            <div className="card-centered-item">
                <img className="cardimage" src={`${Constants.CardsPath}${card.image}`} alt={props.card.value} />
            </div>
        );
    }
}
