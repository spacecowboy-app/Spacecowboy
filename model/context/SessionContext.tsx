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

import { createContext, useReducer } from "react";
import log from "loglevel";
import Session from "@/model/Session";
import SessionResponse, {asSession} from "@/service/dto/SessionResponse";
import SessionContextException from "./SessionContextException";


enum SessionActionTypes {
    CLEAR_SESSION = "ClearSession",
    SET_SESSION = "SetSession",
    SET_SESSION_ID = "SetSessionId",
    SET_OWNER = "SetOwner",
}

/** Clear current session information. */
export const clearSessionAction = () =>
    ({
        type: SessionActionTypes.CLEAR_SESSION,
    } as const);

/**
 * Action to update the session with a session update received from the service.
 * @param session Updated session from service.
 */
export const setSessionAction = (session: SessionResponse) =>
    ({
        type: SessionActionTypes.SET_SESSION,
        session: session,
    } as const);

/**
 * Set the session id, replacing the current session id if set.
 * @param id New session id.
 */
export const setSessionIdAction = (id: string) =>
    ({
        type: SessionActionTypes.SET_SESSION_ID,
        id : id,
    } as const);

/**
 * Set this user as the owner of the session.
 * */
export const setSessionOwnerAction = () =>
    ({
        type: SessionActionTypes.SET_OWNER,
    } as const);


export type SessionActions =
    | ReturnType<typeof clearSessionAction>
    | ReturnType<typeof setSessionAction>
    | ReturnType<typeof setSessionIdAction>
    | ReturnType<typeof setSessionOwnerAction>


const initialSessionState: Session = {
    participants: [],
    votingCompleted: false,
};

export const SessionContext = createContext<Session>(initialSessionState);
export const SessionDispatchContext = createContext<(a: SessionActions) => void>(() => {});

interface Props
{
    children: JSX.Element[]|JSX.Element
}


/**
 * Context provider for the theme variant.
 */
export function SessionProvider(props: Props): JSX.Element
{
    const [ sessionState, dispatch ] = useReducer(sessionStateReducer, initialSessionState);

    return (
        <SessionContext.Provider value={sessionState}>
            <SessionDispatchContext.Provider value={dispatch}>
                {props.children}
            </SessionDispatchContext.Provider>
        </SessionContext.Provider>
    );
}


/**
 * Reducer function for the session state context
 */
export function sessionStateReducer(session: Session, action: SessionActions): Session
{
    switch (action.type) {

        case SessionActionTypes.CLEAR_SESSION: {
            log.debug("Clear current session");
            return initialSessionState;
        }

        case SessionActionTypes.SET_SESSION: {
            log.debug("Update session");
            const s = asSession(action.session);
            if (session.id && session.id != s.id) {
                throw new SessionContextException(`Trying to change the session id from ${session.id} to ${s.id}`);
            }
            return {
                ...session,
                id: s.id,
                participants: s.participants,
                deck: s.deck,
                noVote: s.noVote,
                notRevealed: s.notRevealed,
                createTime: s.createTime,
                generation: s.generation,
                votingCompleted: s.votingCompleted,
            };
        }

        case SessionActionTypes.SET_SESSION_ID: {
            log.debug(`Setting session id to [${action.id}]`);
            return {
                ...session,
                id: action.id,
            };
        }

        case SessionActionTypes.SET_OWNER: {
            log.debug(`Setting session owner status for session`);
            return {
                ...session,
                owner: true,
            };
        }

        default:
            log.error(`Unknown action: ${JSON.stringify(action)}`);
            return session;
    }
}
