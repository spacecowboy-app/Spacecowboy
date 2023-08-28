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

import React, { useContext } from "react";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Charm from "./Charm";
import Participant from "@/model/Participant";
import { SessionContext } from "@/model/context/SessionContext";


/**
 * Component to visualize the participants in a session and who has currently voted.
 */
export default function VotingParticipants(): JSX.Element
{
    const session = useContext(SessionContext);

    // Function to return an avatar for a participant.
    const getAvatar = (p: Participant) => (
        <Stack key={p.id} alignItems="center">
            <Charm charm={p.avatar.charm} variant="small" />
            <Typography>{p.avatar.name}</Typography>
        </Stack>
    );

    return (
        <Stack spacing={4} direction="row">
            <Stack spacing={1} alignItems="left">
                <Typography>Voted:</Typography>
                <Stack direction="row">
                    { session.participants.filter(p => p.vote != session.noVote?.id).map(p => getAvatar(p)) }
                </Stack>
            </Stack>
            <Stack spacing={1} alignItems="left">
                <Typography>Not yet voted:</Typography>
                <Stack direction="row">
                    { session.participants.filter(p => p.vote == session.noVote?.id).map(p => getAvatar(p)) }
                </Stack>
            </Stack>
        </Stack>
    );
}
