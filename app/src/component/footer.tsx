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

import Configuration from "../Config";

import "./footer.css";

/**
 * Application footer
 */
export default function FooterPanel(): JSX.Element
{
    return (
        <div className="footer shadedcontainer">
            <div className="footerInfoPanel">
                <p className="footerInfoStrong">Space Cowboy</p>
                <p>the place in space for fast decisions and great collaboration on the world wild web and the galaxy</p>
                <p></p>
                <p>No warranty. No personal data collected.</p>
                <p className="copyrightnotice">&copy; Copyright 2021 Rolf Michelsen and Tami Weiss<br/>
                                                Version: {Configuration.Version}</p>
            </div>
            <div className="footerContactPanel">
                <p className="footerInfoStrong">Send feedback</p>
                <p>Space Cowboy HQ</p>
                <p>OSLO NORWAY</p>
                <p><a className="emaillink" href="mailto:howdy@spacecowboy.app">howdy@spacecowboy.app</a></p>
            </div>
        </div>
    );
}
