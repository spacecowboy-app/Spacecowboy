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

import Alert from "@mui/material/Alert";
import React, { SyntheticEvent, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import log from "loglevel";
import { useRouter } from "next/router";

import Constants from "@/constants";
import Service from "@/service/Service";

import HeroImage from "@/images/hero/place.png";



export default function StartGame(): JSX.Element {
    const [ sessionId, setSessionId ] = useState<string|undefined>(undefined);
    const [ errorOpen, setErrorOpen ] = useState<boolean>(false);
    const router = useRouter();

    // Get default session name and set as value for input field
    // TODO: For some reason there are two calls to GetRandomSessionId() when loading this screen
    useEffect(() => {
        if (sessionId === undefined) {
            Service.GetRandomSessionId()
            .then(result => { 
                log.debug(`Got random session name ${result}`);
                setSessionId(result);
            })
            .catch(() => setErrorOpen(true) );
        }
    }, [ sessionId ]);

    return (
        <>
            <Box component="form" onSubmit={(e:React.SyntheticEvent) => startSession(e)}>
                <Stack spacing={2} alignItems="center">
                    <Image src={HeroImage} alt="Welcome to Spacecowboy" />
                    <Typography variant="h3">Name your space or take one here</Typography>
                    <TextField id="session-id" value={sessionId ?? ""} error={false} label={undefined} autoFocus={true} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSessionId(e)} />
                    <Button variant="contained" type="submit" disabled={false} >take this place</Button>
                </Stack>
            </Box>
            <Snackbar open={errorOpen} autoHideDuration={Constants.SnackbarDuration} onClose={handleErrorClose} anchorOrigin={Constants.SnackbarAnchor} >
                <Alert severity="error">
                    Unable to communicate with Space Cowboy service
                </Alert>
            </Snackbar>
        </>
    );


    /** Callback for closing the error snackbar. */
    function handleErrorClose(event: SyntheticEvent<any, Event>|Event, reason: SnackbarCloseReason): void
    {
        if (reason == "clickaway") {
            return;
        }
        setErrorOpen(false)
    }


    /** Callback for changing the session id text field.  */
    function updateSessionId(e: React.ChangeEvent<HTMLInputElement>): void 
    {
        const id = e.target.value.trim();
        setSessionId(id);
    }


    /**
     * Callback for starting a new session.
     * Redirects to the session screen.
     */
    function startSession(e: React.SyntheticEvent): void
    {
        e.preventDefault();
        log.info(`Starting a new session ${sessionId}`);
        router.push({ pathname:"/[session]", query: { session: sessionId } });
    }
}
