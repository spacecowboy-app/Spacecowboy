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

import React, { useState, useRef, useEffect, SyntheticEvent } from "react";
import { useHistory } from "react-router-dom";

import joinImageUrl from "../images/hero/join.png";


type Props = {
    setSession?: (id:string|undefined) => void;
};

/**
 * Screen for entering the name of an existing session to join
 */
export default function JoinScreen(props: Props): JSX.Element
{
    const [sessionId, setSession] = useState<string>("");
    const focusControl = useRef<HTMLInputElement>(null);
    const history = useHistory();

    useEffect(() => {
        focusControl.current?.focus();
    }, []);

    if (props.setSession) {
        props.setSession(undefined);
    }

    return (
        <form className="screencontainer" onSubmit={(e) => onSubmit(e)} >
            <img className="imagepanel" src={joinImageUrl} alt="" />
            <h2>The name of the place is</h2>
            <input ref={focusControl} className="inputcontrol" value={sessionId} onChange={(e) => {setSession(e.target.value); }} />
            <input className="button" type="submit" disabled={sessionId===""} value="join this place" />
        </form>
    );


    function onSubmit(e: SyntheticEvent): void
    {
        e.preventDefault();
        const pos = sessionId.lastIndexOf("/");
        history.push(pos == -1 ? sessionId : sessionId.substring(pos+1));
    }

}
