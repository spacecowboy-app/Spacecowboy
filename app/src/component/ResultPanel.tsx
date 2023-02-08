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

import React from "react";
import { useSelector } from "react-redux";
import log from "loglevel";

import AppState from "../store/Store";
import { Card as CardInfo } from "../store/AssetsState";
import { Participant } from "../model/apptypes";
import Service from "../service/service";
import Avatar from "./Avatar";
import Card from "./Card";

import "./ResultPanel.css";
import removeImage from "../images/remove.png";


/**
 * A React component for visualizing the results of a voting session.
 */
export default function ResultPanel(): JSX.Element
{
    const deck = useSelector((state:AppState) => state.session.deck);
    const participants = useSelector((state:AppState) => state.session.participants);
    const sessionId = useSelector((state:AppState) => state.session.id);
    const participantId = useSelector((state: AppState) => state.session.participantId);
    const votingCompleted = useSelector((state: AppState) => state.session.votingCompleted);
    const participantVoteCardId = useSelector((state: AppState) => state.session.participantVoteCardId) ?? deck?.noVote.id;

    if (!deck || !sessionId) {
        return (<> </>);
    }

    const me = participants.find(p => p.id === participantId);
    const others = participants.filter(p => p.id !== participantId);
    others.sort((a,b) => compareParticipants(a,b));
    const all = me === undefined ? others : Array(me).concat(others);

    const votes = all.flatMap((p) => vote(p, sessionId, p.id === participantId, votingCompleted));

    return(
        <div className="verticalpanel">
            <div className="headerpanel">
                <h2>space cowboys</h2>
            </div>
            <div className="resultpanel">
                {votes}
            </div>
            {addParticipantsHint(participants.length)}
        </div>
    );


    function vote(p: Participant, sessionId: string, me: boolean, votingCompleted: boolean): JSX.Element[]
    {
        const card = lookupCard(me && participantVoteCardId && !votingCompleted ? participantVoteCardId : p.vote);
        if (!card) {
            return ([]);
        }
        const participantStyle = p.IsIdle() ? "idleparticipant" : "";
        const removebuttonStyle = p.IsIdle() ? "" : "idleparticipant";
        const meStyle = me ? "participantme" : "";

        return ([
            <span key={`ca${p.id}`} className={`resultcolumn-avatar ${participantStyle} ${meStyle} `}><Avatar name={p.avatar.name} charm={p.avatar.image} /></span>,
            <span key={`cb${p.id}`} className={`resultcolumn-card ${participantStyle}`}><Card card={card} /></span>,
            <span key={`cc${p.id}`} className={`resultcolumn-control ${removebuttonStyle}`} onClick={() => removeParticipant(sessionId, p.id)} ><img src={removeImage} alt="Remove this participant" /></span>
        ]);
    }


    function lookupCard(id: string): CardInfo | undefined
    {
        if (deck?.noVote && id === deck.noVote.id) {
            return deck.noVote;
        }
        else if (deck?.hiddenVote && id === deck.hiddenVote.id) {
            return deck.hiddenVote;
        }
        else if (deck) {
            return deck.cards.find(c => c.id === id);
        }
    }


    function removeParticipant(sessionId: string, participantId: string): void
    {
        log.debug("Attempting to remove participant " + participantId);
        Service.RemoveParticipant(sessionId, participantId);
    }


    function compareParticipants(p1: Participant, p2: Participant): number
    {
        const name1 = p1.avatar.name.toLowerCase();
        const name2 = p2.avatar.name.toLowerCase();
        if (name1 < name2) { return -1; }
        if (name1 > name2) { return 1; }
        return 0;
    }


    function addParticipantsHint(participantCount: number): JSX.Element
    {
        if (participantCount !== 1) {
            return (<></>);
        }

        return (
            <div>
                <p>It is lonely here. Remember to <a href={`/${sessionId}/share`}>invite additional players</a>.</p>
            </div>
        );
    }
}
