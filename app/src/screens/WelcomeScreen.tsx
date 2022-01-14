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
import { Link } from "react-router-dom";

import welcomeImageUrl from "../images/hero/welcome.png";


type Props = {
    setSesstion?: (id: string|undefined) => void;
};


/**
 * Welcome screen
 */
export default function WelcomeScreen(props: Props): JSX.Element
{
    useEffect(() => {
        if (props.setSesstion) {
            props.setSesstion(undefined);
        }
    });

    return (
        <div className="screencontainer">
            <img className="imagepanel" src={welcomeImageUrl} alt="" />
            <div className="headerpanel">
                <h1>welcome space cowboy</h1>
                <h3>Name your space, select a deck and</h3>
                <h3>start a game of agile decision making.</h3>
            </div>
            <div className="horizontalcenterpanel">
                <div className="buttonpanel">
                    <Link to="/start" className="button">start a game</Link>
                </div>
                <div className="buttonpanel">
                    <Link to="/join" className="button">join a game</Link>
                </div>
            </div>
        </div>
    );
}
