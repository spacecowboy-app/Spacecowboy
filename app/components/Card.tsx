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

"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import CardModel, { CardStyle } from "@/model/Card";
import Constants from "@/constants";

/* eslint-disable @next/next/no-img-element */


interface Props {

    /** The card to render. */
    card: CardModel,

    /* Callback for handling clicking a card.  Passes the card id. */
    handleClick?: (id: string) => void;
}


/** Render a card. */
export default function Card(props: Props): JSX.Element
{
    const theme = useTheme();
    const sizeMultiplier = useMediaQuery(theme.breakpoints.up("md")) ? 1 : 0.7;

    const cardHoverSx = props.handleClick ?
        {
            "&": {
                transitionProperty: "transform",
                transitionDuration: "0.25s",
            },
            "&:hover": {
                transform: "scale(1.1, 1.1)",
                cursor: "pointer",
            }
        }
        :
        {
            "&": {},
            "&:hover": {}
        };

    const cardSx = {
        ...cardHoverSx,
        "&": {
            width: 96 * sizeMultiplier,
            height: 128 * sizeMultiplier,
            margin: "8px",
            border: 0,
            borderRadius: "7px",
            padding: "4px",
            color: "black",
            background: `var(--${props.card.color})`,
            opacity: props.card.isDisabled ? 0.2 : 1,
        }
    };

    const imageSize = 76 * sizeMultiplier;

    // TODO Handle bug if trying to lookup a card style that is not defined here in a good way
    const deckStyles: Record<CardStyle, (c: CardModel) => JSX.Element> = {
        "value-image": CardValueAndImage,
        "image-value": CardImageAndValue,
        "centered-image": CardCenteredImage,
    };

    const fontStyles = {
        "small": { fontSize: 16 * sizeMultiplier },
        "large": { fontSize: 32 * sizeMultiplier, fontWeight: "bold" },
    }

    const cardColor = `var(--${props.card.color})`;
    const layoutFunction = props.card.style ? deckStyles[props.card.style] : CardCenteredImage;

    return (
        <Box sx={cardSx} onClick={() => { if (props.handleClick) props.handleClick(props.card.id); }}>
            { layoutFunction(props.card) }
        </Box>
    );


    /** Render a card with a value and an image stacked vertically */
    function CardValueAndImage(card: CardModel): JSX.Element
    {
        return (
            <Stack alignItems="center" justifyContent="space-between" sx={{height: "100%"}}>
                <Typography align="center" sx={fontStyles[card.font ?? "small"]}>{card.value}</Typography>
                <img src={`${Constants.CardsPath}/${card.image}`} width={imageSize} height={imageSize} alt={props.card.value ?? ""} />
            </Stack>
        );
    }

    /** Render a card with an image and a card stacked vertically */
    function CardImageAndValue(card: CardModel): JSX.Element
    {
        return (
            <Stack alignItems="center" justifyContent="space-between" sx={{height: "100%"}}>
                <img src={`${Constants.CardsPath}/${card.image}`} width={imageSize} height={imageSize} alt={props.card.value ?? ""} />
                <Typography align="center" sx={fontStyles[card.font ?? "small"]}>{card.value}</Typography>
            </Stack>
        );
    }


    /** Render a card with a centered image only */
    function CardCenteredImage(card: CardModel): JSX.Element
    {
        return (
            <Stack alignItems="center" justifyContent="center">
                <img src={`${Constants.CardsPath}/${card.image}`} width={imageSize} height={imageSize} alt={props.card.value ?? ""} />
            </Stack>
        );
    }

}


