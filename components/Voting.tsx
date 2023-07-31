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

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import log from "loglevel";

import DeckGallery from "./DeckGallery";
import VotingParticipants from "./VotingParticipants";
import Constants from "@/constants";
import { SessionContext } from "@/model/context/SessionContext";
import { castVoteAsync } from "@/service/Service";


// TODO Document voting component
export default function Voting(): JSX.Element
{
    const session = useContext(SessionContext);
    const [ vote, setVote ] = useState<string|undefined>();                                              // Card id of current players vote
    const [ serviceErrorOpen, setServiceErrorOpen ] = useState<string|undefined>();         // Set when service error alert is visible.  Value is error message.

    if (!session?.deck) {
        log.error("No deck available in this session");
        return (<></>);
    }

    if (!session?.id) {
        log.error("No id set on this session");
        return (<></>);
    }

    if (!session?.participantId) {
        log.error("No participant id set on this session");
        return (<></>);
    }

    return (
        <>
            <Stack spacing={2} alignItems="center">
                <Typography variant="h1">Place your vote</Typography>
                <DeckGallery cards={session.deck.map(c => vote == c.id ? {...c, isDisabled: true} : c )} selectCard={placeVote} />
                <VotingParticipants />
            </Stack>
            <Snackbar open={serviceErrorOpen !== undefined} autoHideDuration={Constants.SnackbarDurationMs} onClose={() => setServiceErrorOpen(undefined)} anchorOrigin={Constants.SnackbarAnchor} >
                <Alert severity="error">
                    { serviceErrorOpen }
                </Alert>
            </Snackbar>
        </>
    );


    /** Place a vote on behalf of the current player. */
    function placeVote(cardId: string): void
    {
        castVoteAsync(session.id!, session.participantId!, cardId)
            .then(() => {
                setVote(cardId);
                log.info(`Cast vote with id ${cardId}`);
            })
            .catch(() => setServiceErrorOpen("Unable to place vote with remote service."));
    }
}
