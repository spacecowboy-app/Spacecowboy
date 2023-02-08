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

import React, {useState} from "react";
import { Redirect, useParams } from "react-router-dom";
import log from "loglevel";

import shareRoomImageUrl from "../images/hero/join.png";


type Props = {
    setSession?: (id: string|undefined) => void;
};

type RouteParams = {
    sessionId: string;
};


/**
 * Screen for sharing a room with other potential participants.
 */
export default function ShareRoomScreen(props: Props): JSX.Element
{
    let roomlink: HTMLInputElement | null = null;

    const { sessionId } = useParams<RouteParams>();

    const [redirect, setRedirect] = useState<boolean>(false);

    const sessionLink = `${document.location.origin}/${sessionId}`;

    if (redirect) {
        return (<Redirect to={`/${sessionId}`} />);
    }

    if (props.setSession) {
        props.setSession(sessionId);
    }

    return (
        <div className="screencontainer">
            <img className="imagepanel" src={shareRoomImageUrl} alt="Share your room" />
            <div className="headerpanel">
                <h1>Invite more space cowboys</h1>
                <input className="inputcontrol" ref={(input) => roomlink = input}  value={sessionLink} size={sessionLink.length} readOnly />
            </div>
            {document.queryCommandSupported("copy") &&
            <div className="buttonpanel">
                <button className="button" onClick={copyToClipboard} >copy link</button>
            </div>
            }
            <div className="row">
                <p>copy, paste and send the link</p>
            </div>
        </div>
    );


    function copyToClipboard(): void
    {
        if (roomlink) {
            roomlink.select();
            document.execCommand("copy");
            log.debug(`Room link ${sessionLink} copied to clipboard`);
            setRedirect(true);
        }
    }
}