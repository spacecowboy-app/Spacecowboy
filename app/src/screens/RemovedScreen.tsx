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
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { clearSessionAction } from "../store/SessionState";


/**
 * Screen providing information about participant having been removed from a session
 */
export default function RemovedScreen(): JSX.Element
{
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearSessionAction());
    });


    return (
        <div className="screencontainer">
            <img className="imagepanel" src="/images/noplace.png" alt="" />
            <div className="headerpanel">
                <h2>You have been removed from the destination</h2>
                <h3>If you believe that this happened in error, reach out to the organizer and join again.</h3>
            </div>
            <div className="buttonpanel">
                <Link to="/" className="button">go back</Link>
            </div>
        </div>
    );
}