/*
    Copyright 2021-2026 Rolf Michelsen and Tami Weiss

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
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import log from "loglevel";

import VotingResultList from "./VotingResultList";
import Constants from "@/constants";
import { SessionContext } from "@/model/context/SessionContext";
import { resetVotesAsync } from "@/service/Service";


// TODO Document this component
export default function VotingResult(): JSX.Element
{
    const session = useContext(SessionContext);
    const [ serviceErrorMessage, setServiceErrorMessage ] = useState<string|undefined>();         // Set when service error alert is visible.  Value is error message.

    return (
        <>
            <Stack spacing={2} alignItems="center">
                <Typography variant="h1">Voting results</Typography>
                <VotingResultList />
                <Button variant="contained" onClick={startNextRound} >next round</Button>
            </Stack>
            <Snackbar open={serviceErrorMessage !== undefined} autoHideDuration={Constants.SnackbarDurationMs} onClose={() => setServiceErrorMessage(undefined)} anchorOrigin={Constants.SnackbarAnchor} >
                <Alert severity="error">
                    { serviceErrorMessage }
                </Alert>
            </Snackbar>
        </>
    );


    /** Reset all votes to start a new voting round. */
    function startNextRound(): void
    {
        resetVotesAsync(session.id!)
            .then(() => log.info("Reset votes"))
            .catch(() => setServiceErrorMessage("Unable to clear vote with remote service to start a new round."));
    }
}
