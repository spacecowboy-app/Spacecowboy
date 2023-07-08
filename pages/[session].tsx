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

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSessionState } from "@/state/PersistentSessionState";
import { sessionIdExistsAsync } from "@/service/Service";
import log from "loglevel";
import { SessionContext, SessionDispatchContext, setSessionIdAction } from "@/model/context/SessionContext";
import ServiceEvents from "@/service/ServiceEvents";
import AvatarCreator from "@/components/AvatarCreator";


enum ServiceConnectionState {
    NotConnected,
    Connected
}


// TODO Add documentation
export default function Session(): JSX.Element
{
    const router = useRouter();
    const sessionId = router.query.session as string;
    const session = useContext(SessionContext);
    const dispatch = useContext(SessionDispatchContext);
    const [connectionState, setConnectionState] = useState<ServiceConnectionState>(ServiceConnectionState.NotConnected);

    // TODO Document purpose
    useEffect(() => {
        checkSession();

        async function checkSession()
        {
            try {
                const sessionState = getSessionState();
                if (!sessionState) {
                    if (await sessionIdExistsAsync(sessionId)) {
                        dispatch(setSessionIdAction(sessionId));
                    }
                    else {
                        router.push({ pathname:"/[session]/notfound", query: { session: sessionId } });
                    }
                }
            }
            catch {
                log.error("Exception");
            }
        }
    }, [dispatch, sessionId, router]);

    // Initialize service for listening for service events
    useEffect(() => {
        if (session?.id === sessionId) {
            const events = new ServiceEvents(dispatch);
            log.debug(`Attempting to connect to event hub for session ${sessionId}.`);
            events.Connect(sessionId)
                .then(() => {
                    log.debug(`Connected to event hub for session ${sessionId}.`);
                    setConnectionState(ServiceConnectionState.Connected);
                });
            return (() => {
                events.Disconnect();
                setConnectionState(ServiceConnectionState.NotConnected);
                log.debug(`Disconnected from event hub for session ${sessionId}.`);
            });
        }
    }, [sessionId, session.id, dispatch]);

    /* No session information available yet. Wait until the session update listener has fired at least once. */
    if (session?.id === null) {
        return (<p>Waiting for data from the server...</p>);
    }

    if (connectionState !== ServiceConnectionState.Connected) {
        return (<p>Waiting for connection to service...</p>);
    }

    /* Create avatar and register in this session. */
    if (!session.participantId) {
        return (<AvatarCreator/>);
    }

    return (<>In session {router.query.session}</>);
}
