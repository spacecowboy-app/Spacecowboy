/*
    Copyright 2021 Rolf Michelsen and Tami Weiss

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
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import log from "loglevel";

import ServiceEvents from "../service/serviceevents";
import AppState from "../store/Store";
import { participantSeenInSessionAction, setParticipantAuthorizationAction, setParticipantIdAction, setParticipantVoteAction, setSessionIdAction, SessionActions } from "../store/SessionState";

import AvatarCreatorScreen from "../screens/AvatarCreatorScreen";
import DeckSelectorScreen from "../screens/DeckSelectorScreen";
import VoteScreen from "../screens/VoteScreen";
import Service from "../service/service";
import PersistentStorage from "../PersistentStorage";


type RouteParams = {
    sessionId: string;
};


enum ServiceConnectionState {
    NotConnected,
    Connected
}


/**
 * Component for orchestrating a given sessionInfo as identified in the URL.
 */
export default function SessionHub(): JSX.Element
{
    const dispatch = useDispatch();

    const [ connectionState, setConnectionState ] = useState<ServiceConnectionState>(ServiceConnectionState.NotConnected);
    const { sessionId } = useParams<RouteParams>();
    const history = useHistory();

    const serviceSessionId = useSelector((state:AppState) => state.session.id);
    const deck = useSelector((state:AppState) => state.session.deck);
    const participants = useSelector((state:AppState) => state.session.participants);
    const participantId = useSelector((state:AppState) => state.session.participantId);
    const participantAuthorization = useSelector((state:AppState) => state.session.participantAuthorization);
    const participantSeenInSession = useSelector((state:AppState) => state.session.participantSeenInSession);

    /* Verify that the session exists.  If it does, update state.  If not, redirect to "not found" screen.
       This also restores a participant from persistent store when applicable. */
    useEffect(() => {

        checkSession();

        async function checkSession()
        {
            try {
                const participantState = PersistentStorage.getParticipantState();

                /* No information about this participant having participated in a session. */
                if (participantState === null) {
                    if (await Service.SessionIdExists(sessionId)) {
                        dispatch(setSessionIdAction(sessionId));
                    }
                    else {
                        history.push(`/${sessionId}/notfound`);
                    }
                }
                /* This participant has recently participated in a session.  If it is this session, try
                   to restore the participation in this session. */
                else {
                    const session = await Service.GetSession(sessionId, participantState.participantId);
                    if (session !== null) {
                        dispatch(setSessionIdAction(sessionId));
                        const participant = session.participants.find(p => p.id === participantState.participantId);
                        if (participant) {
                            dispatch(setParticipantIdAction(participantState.participantId));
                            dispatch(setParticipantAuthorizationAction(sessionId, participantState.participantAuthorization));
                            if (session?.deck?.cards && participant.vote && session.deck.cards.find((c) => (c.id === participant.vote))) {
                                dispatch(setParticipantVoteAction(participant.vote));
                            }
                        }
                        else {
                            PersistentStorage.clearParticipantState();
                        }
                    }
                    else {
                        PersistentStorage.clearParticipantState();
                        history.push(`/${sessionId}/notfound`);
                    }
                }
            }
            catch {
                log.warn("Caught exception");
            }
        }
    }, [dispatch, sessionId, history]);

    /* Initialize the signalR connection with the service. */
    useEffect(() => {
        if (serviceSessionId === sessionId) {
            const se = new ServiceEvents((action: SessionActions) => { dispatch(action); } );
            log.debug(`Attempting to connect signalr for session ${sessionId}`);
            se.Connect(sessionId).then(() => {
                log.debug(`Started signalr connection for session ${sessionId}`);
                setConnectionState(ServiceConnectionState.Connected);
            });
            return (() => {
                se.Disconnect();
                setConnectionState(ServiceConnectionState.NotConnected);
                log.debug(`Disconnected signalr connection for session ${sessionId}`);
            });
        }
    }, [sessionId, serviceSessionId, dispatch]);

    /* No session information available yet. Wait until the session update listener has fired at least once. */
    if (!serviceSessionId) {
        return (<></>);
    }

    if (connectionState !== ServiceConnectionState.Connected) {
        return (<p>Waiting for connection to service...</p>);
    }

    /* If we do not have a deck for this session and this participant is authorized, select a deck. */
    if (!deck && participantAuthorization) {
        return (<DeckSelectorScreen />);
    }

    /* If participant has no id for this session, create an avatar and register participant in session. */
    if (!participantId) {
        return (<AvatarCreatorScreen />);
    }

    if (!deck) {
        return (<p>Waiting for session to be set up...</p>);
    }

    /* If I'm no longer finding myself as a participant in this session, I have probably been removed... */
    if (!participants.find(p => p.id === participantId)) {
        if (participantSeenInSession) {
            return (<Redirect to={`/${sessionId}/removed`} />);
        }
    }
    else {
        if (!participantSeenInSession) {
            dispatch(participantSeenInSessionAction());
        }
    }

    return(
        <> { participantId && <VoteScreen playerId={participantId} /> } </>
    );

}
