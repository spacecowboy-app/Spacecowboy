/*
    Copyright 2021-2025 Rolf Michelsen and Tami Weiss

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

import Stack from "@mui/material/Stack";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import Constants from "@/constants";

/* eslint-disable @next/next/no-img-element */


interface Props {

    /** Relative path to charm. */
    charm: string,

    /** Charm size. */
    variant: "small"|"large",

    /** Callback for selecting a charm.  The parameter is the relative path to the charm image. */
    selectCharm?: (charm: string) => void,
};


/**
 * Component to render a charm.
 */
export default function Charm(props: Props): JSX.Element
{
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    const smallSize = matches ? 64 : 48;
    const largeSize = matches ? 200 : 128;
    const size = props.variant == "large" ? largeSize : smallSize;

    const charmHoverSx = {
        "&": {
            transitionProperty: "transform",
            transitionDuration: "0.25s",
        },
        "&:hover": {
            transform: "scale(1.1, 1.1)",
            cursor: "pointer",
        }
    };


    return (
        <Stack borderRadius="50%" bgcolor="primary.light" width={size} height={size} alignItems="center" justifyContent="center" sx={props.selectCharm ? charmHoverSx : {}} >
            <img src={`${Constants.CharmsPath}/${props.charm}`} alt="" width={size} height={size} onClick={() => props.selectCharm && props.selectCharm(props.charm)} />
        </Stack>
    );
}
