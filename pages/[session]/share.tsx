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

import React, { useEffect, useState, SyntheticEvent } from "react";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useRouter } from "next/router";

import log from "loglevel";

import Constants from "@/constants";
import HeroImage from "@/components/HeroImage";

import heroImage from "@/images/hero/place.png";



/**
 * Page for sharing a session with others.
 */
export default function ShareSessionPage(): JSX.Element
{
    const [ sessionUrl, setSessionLink ] = useState<string|undefined>();    // Complete URL to the session, e.g. https://spacecowboy.app/foobar
    const [ infoOpen, setInfoOpen ] = useState<boolean>(false);             // True when the copy link info snackbar is open
    const router = useRouter();
    const sessionId = router.query.session as string;

    // Set sessionUrl from effect hook to ensure client evaluation
    useEffect(() => {
        setSessionLink(`${document.location.origin}/${sessionId}`);
    }, [ setSessionLink, sessionId] );

    if (!sessionUrl) {
        return (<></>);
    }

    return (
        <>
            <Stack spacing={2} alignItems="center">
                <HeroImage src={heroImage} alt="" />
                <Typography variant="h1">Share your place</Typography>
                <Typography variant="h3">Invite more Space Cowboys</Typography>
                <Typography variant="h3">Copy, paste and send the link</Typography>
                <TextField value={sessionUrl} />
                <Button variant="contained" onClick={handleButtonClick} >Copy link and return</Button>
            </Stack>
            <Snackbar open={infoOpen} autoHideDuration={Constants.SnackbarDurationMs} onClose={handleInfoClose} anchorOrigin={Constants.SnackbarAnchor}>
                <Alert severity="info" >
                    Place name copied to clipboard.
                </Alert>
            </Snackbar>
        </>
    );


    /** Handle button click by copying session URL to clipboard and opening the info snackbar.  */
    function handleButtonClick(): void
    {
        navigator.clipboard.writeText(sessionUrl!);
        setInfoOpen(true);
        log.info(`Copied session link to clipboard: ${sessionUrl}`);
    }


    /** Callback for closing the error snackbar and redirect back to the main session screen. */
    function handleInfoClose(event: SyntheticEvent<any, Event>|Event, reason: SnackbarCloseReason): void
    {
        if (reason == "clickaway") {
            return;
        }
        setInfoOpen(false);
        router.replace({ pathname:"/[session]", query: { session: sessionId } });
    }

}
