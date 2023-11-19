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

import { useContext } from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Link from "next/link";
import { useRouter } from "next/router";

import log from "loglevel";

import HeroImage from "@/components/HeroImage";
import { createSessionAsync, getRandomSessionIdAsync, sessionIdExistsAsync } from "@/service/Service";
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

    return (
        <Stack spacing={2} alignItems="center">
            <HeroImage src={heroImage} alt="" />
            <Typography variant="h3">The space {sessionId} does not exist</Typography>
            <Typography variant="h3">You can create it or join another</Typography>
            <Stack spacing={2} direction="row">
                <Button variant="contained" href="/" LinkComponent={Link}>go back</Button>
                <Button variant="contained" onClick={() => startSession() }>create it</Button>
            </Stack>
        </Stack>
    );


    /**
     * Callback for starting a new session.
     * Redirects to the session screen.
     */
    // TODO This code is duplicated from the start page. Should consolidate into a single instance.
    function startSession(): void
    {
        if (sessionId) {
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
    }

}


