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

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useParams } from "react-router-dom";

import Service from "../service/service";
import AppState from "../store/Store";
import { clearSessionAction } from "../store/SessionState";


type RouteParams = {
    sessionId: string;
};


/**
 * Screen for leaving a session
 */
export default function LeaveScreen(): JSX.Element
{
    const dispatch = useDispatch();
    const { sessionId } = useParams<RouteParams>();
    const participantId = useSelector((state:AppState) => state.session.participantId);

    useEffect(() => {
        if (participantId) {
            Service.RemoveParticipant(sessionId, participantId);
        }
        dispatch(clearSessionAction());
    });

    return (
        <Redirect to="/" />
    );
}