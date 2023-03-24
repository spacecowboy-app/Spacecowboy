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


interface Session {
    id: string,
    error?: string,
};


export default function StartGame(): JSX.Element {
    const [ session, setSession ] = useState<Session|undefined>(undefined);
    const router = useRouter();

    // Get default session name and set as value for input field
    // TODO: For some reason there are two calls to GetRandomSessionId() when loading this screen
    useEffect(() => {
        if (session === undefined) {
            Service.GetRandomSessionId()
            .then(result => { 
                log.debug(`Got random session name ${result}`);
                setSession({ id: result, error: validateSessionId(result) });
            })
            .catch(() => log.error("Failed to get session name from service"));
        }
    }, [ session ]);

    return (
        <Box component="form" onSubmit={(e:React.SyntheticEvent) => startSession(e)}>
            <Stack spacing={2} alignItems="center">
                <Image src={HeroImage} alt="Welcome to Spacecowboy" />
                <Typography variant="h3">Name your space or take one here</Typography>
                <TextField id="session-id" value={session?.id ?? ""} error={session?.error !== undefined} label={session?.error} autoFocus={true} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSessionId(e)} />
                <Button variant="contained" type="submit" disabled={session?.error !== undefined} >take this place</Button>
            </Stack>
        </Box>
    );


    function updateSessionId(e: React.ChangeEvent<HTMLInputElement>): void 
    {
        const id = e.target.value.trim();
        setSession({ id: id, error: validateSessionId(id) });
    }


    /** Return an error message if the session id is invalid, otherwise `undefined`. */
    // TODO: Implement check for session name already in use
    function validateSessionId(id: string): string|undefined
    {
        if (id.length == 0)
            return "Please provide space name"

        if (id.length > 50)
            return "Name too long";

        if (RegExp("[/&#?]").test(id))
            return "Name contains invalid characters"
        
        const reservedIds = [ "about", "join", "start" ];
        if (reservedIds.find(e => e == id.toLowerCase()))
            return "Name is reserved";

        return undefined;
    }


    /**
     * Callback for starting a new session
     * Creates the session on the server and redirects to deck selection.
     */
    function startSession(e: React.SyntheticEvent): void
    {
        e.preventDefault();
        // TODO: Add logic to create the session
        log.info(`Starting a new session ${session?.id}`);
        router.push({ pathname:"/[session]", query: { session: session?.id } });
    }


}
