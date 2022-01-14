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
import { Link, useParams } from "react-router-dom";

import noplaceImage from "../images/hero/noplace.png";


type RouteParams = {
    sessionId: string;
};

/**
 * Screen used when navigating to a session that does not exist.
 */
export default function NotFoundScreen(): JSX.Element
{
    const { sessionId } = useParams<RouteParams>();

    return (
        <div className="screencontainer">
            <img className="imagepanel" src={noplaceImage} alt="" />
            <div className="headerpanel">
                <h2>The space <strong>{`${sessionId}`}</strong> does not exist</h2>
                <h3>You can create it or join another</h3>
            </div>
            <div className="buttonpanel">
                <Link to="/" className="button">go back</Link>
            </div>
        </div>
    );
}