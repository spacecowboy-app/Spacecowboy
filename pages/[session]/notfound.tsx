/*
    Copyright 2021-2024 Rolf Michelsen and Tami Weiss

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

import { useContext, useState } from "react";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Link from "next/link";
import { useRouter } from "next/router";

import log from "loglevel";

import Constants from "@/constants";
import HeroImage from "@/components/HeroImage";
import { createSessionAsync } from "@/service/Service";
import { sessionIdIsValid } from "@/model/Session";
import { SessionDispatchContext, clearSessionAction, setSessionIdAction, setSessionOwnerAction } from "@/model/context/SessionContext";
import { storeSessionState } from "@/state/PersistentSessionState";

import heroImage from "@/images/hero/noplace.png";


/**
 * Page shown when attempting to join a session that does not exist.
 * */
export default function SessionNotFound(): JSX.Element
{
    const router = useRouter();
    const sessionId = router.query.session as string;
    const dispatch = useContext(SessionDispatchContext);
    const [ invalidNameOpen, setInvalidNameOpen ] = useState<string|undefined>();

    return (
        <>
            <Stack spacing={2} alignItems="center">
                <HeroImage src={heroImage} alt="" />
                <Typography variant="h1">Lost in space</Typography>
                <Typography variant="h3">The space <strong>{sessionId}</strong> does not exist</Typography>
                <Typography variant="h3">You can create it or join another</Typography>
                <Stack spacing={2} direction="row">
                    <Button variant="contained" href="/" LinkComponent={Link}>go back</Button>
                    <Button variant="contained" onClick={() => startSession() }>create it</Button>
                </Stack>
            </Stack>
            <Snackbar open={invalidNameOpen !== undefined} autoHideDuration={Constants.SnackbarDurationMs} onClose={() => closeInvalidNameOpen()} anchorOrigin={Constants.SnackbarAnchor} >
                <Alert severity="error">
                    { invalidNameOpen }
                </Alert>
            </Snackbar>
        </>
    );


    /**
     * Callback for starting a new session.
     * Redirects to the session screen.
     */
    // TODO This code is duplicated from the start page. Should consolidate into a single instance.
    function startSession(): void
    {
        if (sessionIdIsValid(sessionId) == undefined) {
            log.info(`Starting a new session ${sessionId}`);
            createSessionAsync(sessionId)
                .then(() => {
                    dispatch(clearSessionAction());
                    dispatch(setSessionIdAction(sessionId));
                    dispatch(setSessionOwnerAction());
                    storeSessionState({
                        sessionId: sessionId,
                        isOwner: true
                    });
                    router.push({ pathname:"/[session]", query: { session: sessionId } });
                })
                .catch((error) =>  {
                    // TODO Proper error message in client window
                    log.error(error);
                });
        }
        else {
            log.info(`Attempt to create session with invalid name [${sessionId}].`);
            setInvalidNameOpen("The provided space name is not permitted and cannot be used.");
        }
    }


    function closeInvalidNameOpen(): void
    {
        setInvalidNameOpen(undefined);
        router.push("/");
    }

}


