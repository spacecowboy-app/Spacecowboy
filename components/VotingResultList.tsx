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

import React, { useContext, useState } from "react";

import Grid from '@mui/material/Unstable_Grid2';

import Card from "./Card";
import Charm from "./Charm";
import CardModel from "@/model/Card";
import Participant from "@/model/Participant";
import { SessionContext } from "@/model/context/SessionContext";



/**
 * Render the results of a voting round as a list of avatars and the corresponding vote.
 */
export default function VotingResultList(): JSX.Element
{
    const session = useContext(SessionContext);

    const voteCard = (p: Participant) => session.deck!.find(c => c.id == p.vote);

    const renderParticipantVote = (p: Participant, v?: CardModel): JSX.Element[] => ([
        <Grid key={`${p.id}-charm`} ><Charm charm={p.avatar.charm} size={64} /></Grid>,
        <Grid key={`${p.id}-name`} >{p.avatar.name}</Grid>,
        <Grid key={`${p.id}-vote`} >{v ? <Card card={v} /> : <></>}</Grid>
    ]);

    return (
        <Grid container spacing={2} columns={3} >
            { session.participants.map(p => renderParticipantVote(p, voteCard(p)))}
        </Grid>
    );
}