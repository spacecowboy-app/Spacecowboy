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

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import log from "loglevel";

import CharmSelector from "./CharmSelector";


// TODO Proper documentation of this component. How does it interact with the rest of the application?
/**
 * Avatar creator component.
 */
export default function AvatarCreator(): JSX.Element
{
    const [avatarName, setAvatarName] = useState<string|undefined>();
    const [avatarCharm, setAvatarCharm] = useState<string|undefined>();

    return (
        <>
            <Box component="form" onSubmit={(e:React.SyntheticEvent) => setAvatar(e)}>
                <Stack spacing={2} alignItems="center">
                    <Typography variant="h1">select your charm</Typography>
                    <TextField id="avatar-name" value={avatarName ?? ""} autoFocus={true} label="make your name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAvatarName(e)} />
                    <CharmSelector />
                    <Button variant="contained" type="submit">arrive with charm</Button>
                </Stack>
            </Box>
        </>
    );


    /** Callback for changing the participant name text field.  */
    function updateAvatarName(e: React.ChangeEvent<HTMLInputElement>): void
    {
        setAvatarName(e.target.value);
    }


    /* Callback to register a participant with the selected avatar. */
    function setAvatar(e: React.SyntheticEvent): void
    {
        e.preventDefault();
        // TODO Implement avatar selection
        log.warn("Avatar selection not implemented yet");
    }
}
