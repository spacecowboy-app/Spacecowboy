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

import SessionState, { initialSessionState, sessionReducer, clearSessionAction, setSessionIdAction, clearVotesAction, setParticipantVoteAction } from "../store/SessionState";


test("Clear session state", () => {
    const input: SessionState = {
        ...initialSessionState,
        id: "foo-bar"
    };

    const output: SessionState = sessionReducer(input, clearSessionAction());

    expect(output.id).toBe(undefined);
});


test("Set session identifier", () => {
    const input: SessionState = initialSessionState;

    const output: SessionState = sessionReducer(input, setSessionIdAction("foo-bar"));

    expect(output.id).toBe("foo-bar");
});


test("Clear votes", () => {
    const input: SessionState = {
        ...initialSessionState,
        votingCompleted: true,
        participantVoteCardId: "1a63c4c1-210a-4eae-93d5-cc74e6fbb4ff"
    };
    const output: SessionState = sessionReducer(input, clearVotesAction());

    expect(output.votingCompleted).toBeFalsy();
    expect(output.participantVoteCardId).toBeUndefined();
});


test("Set participant vote", () => {
    const input: SessionState = {
        ...initialSessionState
    };
    const vote = "02577a63-5f7d-4b80-9322-e23416804f84";
    const output: SessionState = sessionReducer(input, setParticipantVoteAction(vote));

    expect(output.participantVoteCardId).toBe(vote);
});