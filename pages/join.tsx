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

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import log from "loglevel";
import React, { SyntheticEvent, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";

import HeroImage from "@/components/HeroImage";
import Session from "@/model/Session";

import heroImage from "@/images/hero/join.png";


export default function JoinGame(): JSX.Element
{
    const [ sessionId, setSessionId ] = useState<string>("");
    const [ sessionError, setSessionError ] = useState<string|undefined>(Session.IsValidId(sessionId));
    const router = useRouter();

    return (
        <Box component="form" onSubmit={(e:React.SyntheticEvent) => joinSession(e)}>
            <Stack spacing={2} alignItems="center">
                <HeroImage src={heroImage} alt="" />
                <Typography variant="h3">The name of the place is</Typography>
                <TextField id="session-id" value={sessionId} error={sessionError !== undefined} label={sessionError} autoFocus={true} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSessionId(e)} />
                <Button variant="contained" type="submit" disabled={sessionError != undefined} >join this place</Button>
            </Stack>
        </Box>
    );

    /** Callback for changing the session id text field.  */
    function updateSessionId(e: React.ChangeEvent<HTMLInputElement>): void
    {
        const id = e.target.value.trim();
        setSessionId(id);
        setSessionError(Session.IsValidId(id));
    }

    /**
     * Callback for joining a session.
     * Redirects to the session screen.
     */
    function joinSession(e: React.SyntheticEvent): void
    {
        e.preventDefault();
        log.info(`Joining session ${sessionId}`);
        router.push({ pathname:"/[session]", query: { session: sessionId } });
    }

}
