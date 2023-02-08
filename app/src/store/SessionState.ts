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

import { Deck } from "./AssetsState";
import { Participant } from "../model/apptypes";


export default interface SessionState {

    /** Session identifier, undefined when no session information retrieved from service */
    readonly id: string|undefined;

    /** The card deck used for this session */
    readonly deck: Deck|undefined;

    /** Information about all participants */
    readonly participants: Participant[];

    /** Set when voting is completed and votes have been revealed */
    readonly votingCompleted: boolean;

    /** Monotonously increasing generation counter for session state */
    readonly generation: number;

    /** The ID of this participant in the session */
    readonly participantId: string|undefined;

    /** The authorization key for this participant in the session */
    readonly participantAuthorization: string|undefined;

    /** Set when the participant has been seen in the shared session information. */
    readonly participantSeenInSession: boolean;

    /** Card ID of the vote cast by this participant, or undefined if a vote has not been cast yet. */
    readonly participantVoteCardId: string|undefined;
}


export const initialSessionState: SessionState = {
    id: undefined,
    deck: undefined,
    participants: [],
    votingCompleted: false,
    generation: 0,
    participantId: undefined,
    participantAuthorization: undefined,
    participantVoteCardId: undefined,
    participantSeenInSession: false
};


enum SessionActionTypes {
    CLEAR_SESSION = "ClearSession",
    CLEAR_VOTES = "ClearVotes",
    PARTICIPANT_SEEN_IN_SESSION = "ParticipantSeenInSession",
    SET_DECK = "SetSessionDeck",
    SET_GENERATION = "SetGeneration",
    SET_PARTICIPANT_AUTHORIZATION = "SetParticipantAuthz",
    SET_PARTICIPANT_ID = "SetParticipantId",
    SET_PARTICIPANT_VOTE = "SetParticipantVote",
    SET_PARTICIPANTS = "SetParticipants",
    SET_SESSION_ID = "SetSessionId",
    SET_VOTING_COMPLETE = "SetVotingComplete"
}

/** The participant is not participating in any session */
export const clearSessionAction = () =>
    ({
        type: SessionActionTypes.CLEAR_SESSION
    } as const);


/** Clear session votes */
export const clearVotesAction = () =>
    ({
        type: SessionActionTypes.CLEAR_VOTES
    } as const);


export const participantSeenInSessionAction = () =>
    ({
        type: SessionActionTypes.PARTICIPANT_SEEN_IN_SESSION
    } as const);


/** Set the deck used in this session */
export const setDeckAction = (deck: Deck) =>
    ({
        type: SessionActionTypes.SET_DECK,
        deck: deck
    } as const);


/** Set the session generation counter */
export const setGenerationAction = (generation: number) =>
    ({
        type: SessionActionTypes.SET_GENERATION,
        generation: generation
    } as const);


/** Set the session authorization key for this participant */
export const setParticipantAuthorizationAction = (sessionId: string, authz: string) =>
    ({
        type: SessionActionTypes.SET_PARTICIPANT_AUTHORIZATION,
        sessionId: sessionId,
        authorization: authz
    } as const);


/** Set the ID of this participant in this session */
export const setParticipantIdAction = (id: string) =>
    ({
        type: SessionActionTypes.SET_PARTICIPANT_ID,
        participantId: id
    } as const);


export const setParticipantVoteAction = (cardId: string) =>
    ({
        type: SessionActionTypes.SET_PARTICIPANT_VOTE,
        participantVoteCardId: cardId
    } as const);


/** Set session participant information */
export const setParticipantsAction = (participants: Participant[]) =>
    ({
        type: SessionActionTypes.SET_PARTICIPANTS,
        participants: participants
    } as const);


/** The participant is participating in a session */
export const setSessionIdAction = (id: string) =>
    ({
        type: SessionActionTypes.SET_SESSION_ID,
        id: id
    } as const);


export const setVotingCompleteAction = (complete: boolean) =>
    ({
        type: SessionActionTypes.SET_VOTING_COMPLETE,
        complete: complete
    } as const);


export type SessionActions =
    | ReturnType<typeof clearVotesAction>
    | ReturnType<typeof participantSeenInSessionAction>
    | ReturnType<typeof setParticipantAuthorizationAction>
    | ReturnType<typeof setParticipantIdAction>
    | ReturnType<typeof setParticipantVoteAction>
    | ReturnType<typeof setParticipantsAction>
    | ReturnType<typeof setSessionIdAction>
    | ReturnType<typeof setDeckAction>
    | ReturnType<typeof setGenerationAction>
    | ReturnType<typeof setVotingCompleteAction>
    | ReturnType<typeof clearSessionAction>;


export function sessionReducer(state = initialSessionState, action: SessionActions): SessionState
{
    switch (action.type) {
        case SessionActionTypes.CLEAR_SESSION: {
            return initialSessionState;
        }
        case SessionActionTypes.CLEAR_VOTES: {
            return {
                ...state,
                votingCompleted: false,
                participantVoteCardId: undefined
            };
        }
        case SessionActionTypes.PARTICIPANT_SEEN_IN_SESSION: {
            return {
                ...state,
                participantSeenInSession: true
            };
        }
        case SessionActionTypes.SET_PARTICIPANT_AUTHORIZATION: {
            return {
                ...state,
                id: action.sessionId,
                participantAuthorization: action.authorization
            };
        }
        case SessionActionTypes.SET_PARTICIPANT_ID: {
            return {
                ...state,
                participantId: action.participantId
            };
        }
        /* Set participant vote locally.  It is not permitted to change the vote if voting is completed. */
        case SessionActionTypes.SET_PARTICIPANT_VOTE: {
            return state.votingCompleted ? state : {
                ...state,
                participantVoteCardId: action.participantVoteCardId
            };
        }
        case SessionActionTypes.SET_PARTICIPANTS: {
            return {
                ...state,
                participants: action.participants
            };
        }
        case SessionActionTypes.SET_SESSION_ID: {
            return {
                ...state,
                id: action.id
            };
        }
        case SessionActionTypes.SET_DECK: {
            return {
                ...state,
                deck: action.deck
            };
        }
        case SessionActionTypes.SET_GENERATION: {
            return {
                ...state,
                generation: action.generation
            };
        }
        case SessionActionTypes.SET_VOTING_COMPLETE: {
            return {
                ...state,
                votingCompleted: action.complete
            };
        }
        default: {
            return state;
        }
    }
}
