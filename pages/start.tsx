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

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import log from "loglevel";
import { useRouter } from "next/router";

import Service from "@/service/Service";

import HeroImage from "@/images/hero/place.png";


export default function StartGame(): JSX.Element {
    const [ sessionId, setSessionId ] = useState<string|undefined>(undefined);
    const router = useRouter();

    // Get default session name and set as value for input field
    // TODO: For some reason there are two calls to GetRandomSessionId() when loading this screen
    useEffect(() => {
        if (sessionId === undefined) {
            log.debug(`SessionId = ${sessionId ?? "undefined"}`)
            Service.GetRandomSessionId()
            .then(result => { 
                log.debug(`Got random session name ${result}`);
                setSessionId(s => s ?? result);
            })
            .catch(() => log.error("Failed to get session name from service"));
        }
    }, [ sessionId ]);

    // TODO: Use a better approach for setting the suggested session name
    if (!sessionId) {
        return (<></>);
    } 

    return (
        <Box component="form" onSubmit={(e:React.SyntheticEvent) => startSession(e)}>
            <Stack spacing={2} alignItems="center">
                <Image src={HeroImage} alt="Welcome to Spacecowboy" />
                <Typography variant="h3">Name your space or take one here</Typography>
                <TextField id="session-id" defaultValue={sessionId} onChange={e => setSessionId(e.target.value)} />
                <Button variant="contained" type="submit" >take this place</Button>
            </Stack>
        </Box>
    );


    /**
     * Callback for starting a new session
     * Creates the session on the server and redirects to deck selection.
     */
    function startSession(e: React.SyntheticEvent): void
    {
        e.preventDefault();
        // TODO: Add logic to create the session
        log.info(`Starting a new session ${sessionId}`);
        router.push({ pathname:"/[session]", query: { session: sessionId } });
    }


}
