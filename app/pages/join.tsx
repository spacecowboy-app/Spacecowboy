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

import React, { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import Link from "next/link";
import { useRouter } from "next/router";

import log from "loglevel";

import HeroImage from "@/components/HeroImage";

import heroImage from "@/images/hero/join.png";


export default function JoinGame(): JSX.Element
{
    const [ sessionId, setSessionId ] = useState<string>("");
    const [ sessionError, setSessionError ] = useState<string|undefined>(sessionIdIsValid(sessionId));
    const router = useRouter();

    // Styling of the INPUT html element inside a TextField.
    const sx = {
        "input": {
            textAlign: "center",
        }
    };

    return (
        <Box component="form" onSubmit={(e:React.SyntheticEvent) => joinSession(e)}>
            <Stack spacing={2} alignItems="center">
                <HeroImage src={heroImage} alt="" />
                <Typography variant="h1">Join a space</Typography>
                <TextField id="session-id" value={sessionId} error={sessionError !== undefined} label={sessionError} autoFocus={true} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSessionId(e)} sx={sx} />
                <Stack spacing={2} direction="row">
                    <Button variant="contained" type="submit" disabled={sessionError != undefined} >join this place</Button>
                    <Button variant="contained" href="/" LinkComponent={Link}>go back</Button>
                </Stack>
            </Stack>
        </Box>
    );

    /** Callback for changing the session id text field.  */
    function updateSessionId(e: React.ChangeEvent<HTMLInputElement>): void
    {
        const id = e.target.value.trim();
        setSessionId(id);
        setSessionError(sessionIdIsValid(id));
    }

    /**
     * Callback for joining a session.
     * Redirects to the session screen.
     */
    function joinSession(e: React.SyntheticEvent): void
    {
        e.preventDefault();
        const pos = sessionId.lastIndexOf("/");
        const id = pos == -1 ? sessionId : sessionId.substring(pos+1);
        log.info(`Joining session ${id}`);
        router.push({ pathname:"/[session]", query: { session: id } });
    }


    /** Validate session name. Accepts any non-empty session name. */
    function sessionIdIsValid(id: string): string|undefined
    {
        return id.trim().length > 0 ? undefined : "Please provide name or url";
    }

}
