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

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import log from "loglevel";

import Service from "../service/service";
import AppState from "../store/Store";
import { setParticipantVoteAction } from "../store/SessionState";

import ResultPanel from "../component/ResultPanel";
import VotePanel from "../component/VotePanel";


type Props = {
    /** ID of current participant */
    playerId: string;
};


/**
 * The voting screen allows a participant to both place a vote and view the voting status of other
 * participants.
 */
export default function VoteScreen(props: Props): JSX.Element
{
    const dispatch = useDispatch();

    const deck = useSelector((state:AppState) => state.session.deck);
    const participants = useSelector((state:AppState) => state.session.participants);
    const votingCompleted = useSelector((state:AppState) => state.session.votingCompleted);
    const sessionId = useSelector((state:AppState) => state.session.id);

    return (
        <>
            <div className="headerpanel">
                <h1>Game on...</h1>
            </div>

            <div className="horizontalpanel">
                <div className="halfpanel">
                    {deck && <VotePanel handleCardSelected={placeVote} />}
                </div>
                <div className="halfpanel">
                    {participants && <ResultPanel />}
                </div>
            </div>

            <div className="buttonrow">
                <button className="button" onClick={resetVotes} disabled={!votingCompleted} >next round</button>
            </div>
        </>
    );


    function placeVote(cardId: string): void
    {
        if (sessionId) {
            log.debug(`I voted ${cardId}`);
            Service.CastVote(sessionId, props.playerId, cardId);
            dispatch(setParticipantVoteAction(cardId));
        }
    }


    function resetVotes(): void
    {
        if (sessionId) {
            log.debug("Resetting votes");
            Service.ResetVotes(sessionId);
        }
    }
}
