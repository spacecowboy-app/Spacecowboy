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
import Image, { StaticImageData } from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import log from "loglevel";

import CharmSelector from "./CharmSelector";
import Constants from "@/constants";
import Avatar from "@/model/Avatar";


interface Props {
    /** Callback for creating an avatar. */
    avatarCreated?: (avatar: Avatar) => void,
}


// TODO Proper documentation of this component. How does it interact with the rest of the application?
/**
 * Avatar creator component.
 */
export default function AvatarCreator(props: Props): JSX.Element
{
    const [avatarName, setAvatarName] = useState<string|undefined>();       // Avatar name
    const [avatarCharm, setAvatarCharm] = useState<string|undefined>();     // Path to avatar charm, relative to `Constants.CharmsPath`.

    return (
        <Box component="form" onSubmit={(e:React.SyntheticEvent) => setAvatar(e)}>
            <Stack spacing={2} alignItems="center">
                <Typography variant="h1">select your charm</Typography>
                <Image src={`${Constants.CharmsPath}/${avatarCharm}`} alt="" width={250} height={250} />
                <TextField id="avatar-name" value={avatarName ?? ""} autoFocus={true} label="make your name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAvatarName(e)} />
                <CharmSelector charmSelected={(charmPath) => setAvatarCharm(charmPath)} />
                <Button variant="contained" type="submit">arrive with charm</Button>
            </Stack>
        </Box>
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
        if (props.avatarCreated) {
            if (avatarName && avatarCharm) {
                props.avatarCreated({ name: avatarName, charm: avatarCharm});
            }
            else {
                log.error("Attempting to create avatar with undefined name or charm.");
            }
        }
    }
}
