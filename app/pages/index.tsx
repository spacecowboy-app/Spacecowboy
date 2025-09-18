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

import React, { useContext, useEffect, useState } from "react";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Link from "next/link";

import log from "loglevel";

import Constants from "@/constants";
import HeroImage from "@/components/HeroImage";
import heroImage from "@/images/hero/welcome.png";
import { SessionContext, SessionDispatchContext, clearSessionAction } from "@/model/context/SessionContext";
import { removeParticipantAsync } from "@/service/Service";


/**
 * The application home page.
 */
export default function Home(): JSX.Element
{
    const session = useContext(SessionContext);
    const dispatch = useContext(SessionDispatchContext);
    const [ errorOpen, setErrorOpen ] = useState<string|undefined>();       // snackbar error message

    // Leave any active session and clear local session state
    useEffect(() => {
        log.debug("Clear session effect : ", session);
        if (session?.id) {
            if (session.participantId) {
                removeParticipantAsync(session.id, session.participantId)
                    .then(() => {
                        log.info(`Removed participant ${session.participantId} from session ${session.id}`);
                        dispatch(clearSessionAction());
                    })
                    .catch(() => {
                        log.error(`Failed to remove participant ${session.participantId} from session ${session.id}`);
                        setErrorOpen(`Communication error with service. Unable to leave ${session.id}`);
                    });
            }
            else {
                dispatch(clearSessionAction());
            }
        }
    }), [dispatch, session];

    return (
        <>
            <Stack spacing={2} alignItems="center">
                <HeroImage src={heroImage} alt="Welcome to Spacecowboy" />
                <Typography variant="h1">Welcome Space Cowboy</Typography>
                <Typography variant="h3">Name your space, select a deck and</Typography>
                <Typography variant="h3">start a game of agile decision making</Typography>
                <Stack spacing={2} direction="row">
                    <Button variant="contained" href="/start" LinkComponent={Link}>start a game</Button>
                    <Button variant="contained" href="/join" LinkComponent={Link}>join a game</Button>
                </Stack>
            </Stack>
            <Snackbar open={errorOpen !== undefined} autoHideDuration={Constants.SnackbarDurationMs} onClose={() => setErrorOpen(undefined)} anchorOrigin={Constants.SnackbarAnchor} >
                <Alert severity="error">
                    <Typography>{ errorOpen }</Typography>
                </Alert>
            </Snackbar>
        </>
    )
}
