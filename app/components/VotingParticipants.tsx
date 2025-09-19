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

import React, { useContext } from "react";

import Divider from "@mui/material/Divider";
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
    const getAvatar = (p: Participant, highlight: boolean) => (
        <Stack key={p.id} alignItems="center">
            <Charm charm={p.avatar.charm} variant="small" />
            <Typography noWrap={false}>{highlight ? <strong>{p.avatar.name}</strong> : p.avatar.name}</Typography>
        </Stack>
    );

    const participants = Array.from(session.participants).sort((p1, p2) => p1.id == session.participantId ? -1 : p1.avatar.name.localeCompare(p2.avatar.name));

    return (
        <Stack spacing={4} direction="row" divider={<Divider orientation="vertical" role="presentation" variant="middle" flexItem />}>
            <Stack spacing={1} alignItems="left">
                <Typography>Voted:</Typography>
                <Stack direction="row" spacing={1}>
                    { participants.filter(p => p.vote != session.noVote?.id).map(p => getAvatar(p, p.id == session.participantId)) }
                </Stack>
            </Stack>
            <Stack spacing={1} alignItems="left">
                <Typography>Not yet voted:</Typography>
                <Stack direction="row" spacing={1}>
                    { participants.filter(p => p.vote == session.noVote?.id).map(p => getAvatar(p, p.id == session.participantId)) }
                </Stack>
            </Stack>
        </Stack>
    );
}
