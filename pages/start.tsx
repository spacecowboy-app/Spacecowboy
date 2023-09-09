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
import React, { SyntheticEvent, useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import log from "loglevel";
import { useRouter } from "next/router";

import HeroImage from "@/components/HeroImage";
import Constants from "../constants";
import {sessionIdIsValid} from "../model/Session";
import { createSessionAsync, getRandomSessionIdAsync, sessionIdExistsAsync } from "../service/Service";
import { SessionDispatchContext, clearSessionAction, setSessionOwnerAction } from "@/model/context/SessionContext";

import heroImage from "../images/hero/place.png";



export default function StartGame(): JSX.Element
{
    const [ sessionId, setSessionId ] = useState<string|undefined>();
    const [ sessionError, setSessionError ] = useState<string|undefined>();
    const [ errorOpen, setErrorOpen ] = useState<boolean>(false);
    const router = useRouter();
    const dispatch = useContext(SessionDispatchContext);

    // Styling of the INPUT html element inside a TextField.
    const sx = {
        "input": {
            textAlign: "center",
        }
    };

    // Get default session name and set as value for input field
    useEffect(() => {
        if (sessionId === undefined) {
            getRandomSessionIdAsync()
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
                    <HeroImage src={heroImage} alt="Welcome to Spacecowboy" />
                    <Typography variant="h3">Name your space or take one here</Typography>
                    <TextField id="session-id" value={sessionId ?? ""} error={sessionError !== undefined} label={sessionError} autoFocus={true} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSessionId(e)} sx={sx} />
                    <Button variant="contained" type="submit" disabled={sessionError != undefined} >take this place</Button>
                </Stack>
            </Box>
            <Snackbar open={errorOpen} autoHideDuration={Constants.SnackbarDurationMs} onClose={handleErrorClose} anchorOrigin={Constants.SnackbarAnchor} >
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
        setErrorOpen(false);
    }


    /** Callback for changing the session id text field.  */
    function updateSessionId(e: React.ChangeEvent<HTMLInputElement>): void
    {
        const id = e.target.value.trim();
        setSessionId(id);
        const validationError = sessionIdIsValid(id);
        if (validationError) {
            setSessionError(validationError);
        }
        else {
            sessionIdExistsAsync(id)
                .then((r) => setSessionError(r ? "Name cannot be used" : undefined))
                .catch(() => { log.warn("Unable to connect to service"); });
        }
    }


    /**
     * Callback for starting a new session.
     * Redirects to the session screen.
     */
    function startSession(e: React.SyntheticEvent): void
    {
        e.preventDefault();
        if (sessionId) {
            log.info(`Starting a new session ${sessionId}`);
            createSessionAsync(sessionId)
                .then(() => {
                    dispatch(clearSessionAction());
                    dispatch(setSessionOwnerAction());
                    router.push({ pathname:"/[session]", query: { session: sessionId } });
                })
                .catch((error) =>  {
                    // TODO Proper error message in client window
                    log.error(error);
                });
        }
    }
}
