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

"use client";

import React, { SyntheticEvent, useContext, useEffect, useState } from "react";

import Alert from "@mui/material/Alert";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";

import { useRouter } from "next/router";

import log from "loglevel";

import AvatarCreator from "@/components/AvatarCreator";
import DeckCreator from "@/components/DeckCreator";
import Voting from "@/components/Voting";
import VotingResult from "@/components/VotingResult";
import Constants from "@/constants";
import Avatar from "@/model/Avatar";
import Deck from "@/model/Deck";
import { sessionIdIsValid } from "@/model/Session";
import { SessionContext, SessionDispatchContext, clearSessionAction, setDeckAction, setParticipantAction, setSessionIdAction, setSessionOwnerAction } from "@/model/context/SessionContext";
import { ServiceEventsContext } from "@/service/ServiceEvents";
import { addDeckAsync, addParticipantAsync, sessionIdExistsAsync } from "@/service/Service";
import { getSessionState, storeSessionState } from "@/state/PersistentSessionState";


/**
 * This is the session management page, visible at https://host/session-name.  Based on the state of the session, this page
 * will render different components.  It manages the following steps of a session:
 *      1.  Creating a deck (by session owner).
 *      2.  Creating an avatar.
 *      3.  Voting.
 *      4.  Voting results.
 */
export default function Session(): JSX.Element
{
    const [ avatarCreatorErrorOpen, setAvatarCreatorErrorOpen ] = useState<boolean>(false);
    const [ deckCreatorErrorOpen, setDeckCreatorErrorOpen ] = useState<boolean>(false);
    const router = useRouter();
    const sessionId = router.query.session as string;
    const session = useContext(SessionContext);
    const dispatch = useContext(SessionDispatchContext);
    const serviceEvents = useContext(ServiceEventsContext);

    /* Initialize local session state and persisted state for participants joining the session.  This
       should already be taken care of for the owner of the session.
       When this effect is completed we know that session.id == sessionId. */
    useEffect(() => {
        setupSession();

        async function setupSession()
        {
            if (!sessionId) {
                log.warn("Session setup but got no sessionId.");
                router.push("/");
                return;
            }

            if (sessionIdIsValid(sessionId)) {
                log.warn(`Session name is not valid [${sessionId}].`);
                router.push("/");
                return;
            }

            log.debug(`Session setup [${sessionId}]`);
            try {
                if (!(await sessionIdExistsAsync(sessionId))) {
                    log.debug(`Setup session [${sessionId}]: Session does not exist on the server.`);
                    router.push({ pathname:"/[session]/notfound", query: { session: sessionId } });
                    return;
                }
                if (session?.id !== sessionId) {
                    dispatch(clearSessionAction());
                    dispatch(setSessionIdAction(sessionId));
                    const persistentState = getSessionState();
                    if (persistentState?.sessionId !== sessionId) {
                        log.debug(`Setup session [${sessionId}]: No persisted state for this session; creating it.`);
                        storeSessionState({
                            sessionId: sessionId
                        });
                    }
                    else {
                        log.debug(`Setup session [${sessionId}]: Restoring persisted state for this session.`);
                        if (persistentState.isOwner) {
                            dispatch(setSessionOwnerAction());
                        }
                    }
                }
            }
            catch {
                // TODO Improve exception handling here.
                log.error("Exception");
            }
        }
    }, [sessionId, session?.id, dispatch, router]);

    // Connect to service to receive service events for the current session.
    useEffect(() => {
        if (sessionId && session?.id == sessionId) {
            if (!serviceEvents) {
                // TODO This should never happen but it might still be a good idea to handle it a bit better.
                log.error("A service event service is not available.");
                router.push({ pathname:"/[session]/notfound", query: { session: sessionId } });
                return;
            }
            serviceEvents.Connect(sessionId);
        }
    }, [serviceEvents, router, sessionId, session.id]);

    if (!sessionId || sessionIdIsValid(sessionId)) {
        return (<></>);
    }

    if (!serviceEvents?.IsConnected()) {
        return (<p>Waiting for connection to service...</p>);
    }

    /* No session information available yet. Wait until the session update listener has fired at least once. */
    if (session?.id === null) {
        return (<p>Waiting for data from the server...</p>);
    }

    /* Let the owner of the session select the deck to use. */
    if ((!session.deck || session.deck.length === 0) && session.owner) {
        return (
            <>
                <DeckCreator deckCreated={registerDeck} />
                <Snackbar open={deckCreatorErrorOpen} autoHideDuration={Constants.SnackbarDurationMs} onClose={handleDeckCreatorErrorClose} anchorOrigin={Constants.SnackbarAnchor} >
                    <Alert severity="error">
                        Unable to communicate with Space Cowboy service to register cards.
                    </Alert>
                </Snackbar>
            </>
        );
    }

    /* Create avatar and register in this session. */
    if (!session.participantId) {
        return (
            <>
                <AvatarCreator avatarCreated={registerParticipant} />
                <Snackbar open={avatarCreatorErrorOpen} autoHideDuration={Constants.SnackbarDurationMs} onClose={handleAvatarCreatorErrorClose} anchorOrigin={Constants.SnackbarAnchor} >
                    <Alert severity="error">
                        Unable to communicate with Space Cowboy service to register participant.
                    </Alert>
                </Snackbar>
            </>
        );
    }

    /* The session owner has not yet selected a deck... */
    if (!session.deck || session.deck.length === 0) {
        return (<p>Waiting for session creator to select a deck...</p>);
    }

    /* Accept votes until voting is completed. */
    if (!session.votingCompleted) {
        return (<Voting />);
    }

    return (<VotingResult />);

    /** Callback for closing the error snackbar. */
    function handleAvatarCreatorErrorClose(event: SyntheticEvent<any, Event>|Event, reason: SnackbarCloseReason): void
    {
        if (reason == "clickaway") {
            return;
        }
        setAvatarCreatorErrorOpen(false);
    }


    /** Callback for closing the deck creator error snackbar. */
    function handleDeckCreatorErrorClose(event: SyntheticEvent<any, Event>|Event, reason: SnackbarCloseReason): void
    {
        if (reason == "clickaway") {
            return;
        }
        setDeckCreatorErrorOpen(false);
    }



    /**
     * Callback for the `AvatarCreator` component.  Adds the participant to the session and updates the session
     * context with the id of the participant.
     * @param avatar Participant avatar.
     */
    function registerParticipant(avatar: Avatar): void
    {
        addParticipantAsync(sessionId, avatar)
            .then((p) => {
                dispatch(setParticipantAction(p.id));
                storeSessionState({
                    sessionId: sessionId,
                    participantId: p.id,
                    isOwner: session.owner,
                });
            })
            .catch(() => {
                setAvatarCreatorErrorOpen(true);
                log.error("Unable to add participant to session");
            });
    }


    /**
     * Callback for the DeckCreator component.  Adds the deck to the session and updates the session context.
     * @param deck Selected deck.
     */
    function registerDeck(deck: Deck): void
    {
        addDeckAsync(sessionId, deck)
            .then((p) => {
                dispatch(setDeckAction(deck));
            })
            .catch(() => {
                setDeckCreatorErrorOpen(true);
                log.error("Unable to add deck to session");
            });
    }
}
