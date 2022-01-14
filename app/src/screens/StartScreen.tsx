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

import React, {useState, useEffect, SyntheticEvent} from "react";
import { useDispatch } from "react-redux";
import {Redirect} from "react-router-dom";
import log from "loglevel";

import { setParticipantAuthorizationAction } from "../store/SessionState";
import Service from "../service/service";
import ValidatingInput from "../component/ValidatingInput";

import startImageUrl from "../images/hero/place.png";


type Props = {
    setSession?: (id: string|undefined) => void;
};


/**
 * Screen for starting a new session. Allows for entering a name for the session.
 */
export default function StartScreen(props: Props): JSX.Element
{
    const dispatch = useDispatch();

    const [sessionId, setSession] = useState<string>("-");
    const [redirect, setRedirect] = useState<string>("");
    const [isValid, setValid] = useState<boolean>(true);

    /* If no sessionId is already set, ask the service to generate a random one. */
    useEffect(() => {
        if (sessionId === "-") {
            Service.GetRandomSessionId()
                .then((id) => setSession(id))
                .catch((error) => log.error(error));
        }
    });

    if (props.setSession) {
        props.setSession(undefined);
    }

    if (redirect !== "") {
        return (<Redirect to={redirect} />);
    }

    return (
        <form className="screencontainer" onSubmit={(e) => startSession(e)}>
            <img className="imagepanel" src={startImageUrl} alt="" />
            <h2>Name your place or take the one here</h2>
            <ValidatingInput value={sessionId} isValid={isValid} onChange={changeSessionId} />
            <input className="button" type="submit" disabled={!isValid} value="take this place" />
        </form>
    );


    /**
     * Callback for starting a new session
     * Creates the session on the server and redirects to deck selection.
     */
    function startSession(e: SyntheticEvent): void
    {
        e.preventDefault();
        Service.CreateSession(sessionId)
            .then(() => {
                dispatch(setParticipantAuthorizationAction(sessionId, sessionId));
                setRedirect(`/${sessionId}`);
            })
            .catch((error) => log.error(error));
    }


    /**
     * Callback for value change in the session input field
     * Verify validity of the current session identifier.
     * @param id Session identifier
     */
    function changeSessionId(id: string): void
    {
        setSession(id);

        // TODO: Allow special URL characters in session identifiers through proper URL-encoding all over the place
        if (RegExp("[/&#?]").test(id)) {
            setValid(false);
            return;
        }

        Service.SessionIdExists(id)
            .then((r) => { setValid(!r); })
            .catch(() => {
                setValid(false);
                log.warn(`Unable to determine whether session ${id} already exists`);
            });
    }

}
