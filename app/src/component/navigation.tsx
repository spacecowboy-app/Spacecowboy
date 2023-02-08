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
import { Link } from "react-router-dom";

import "./navigation.css";
import Logo from "../images/logo.png";


type Props = {
    children: NavigationItem[];
};


export type NavigationItem = {
    link: string;
    text: string;
};


/**
 * Navigation conmponent
 */
export default function Navigation(props: Props): JSX.Element
{
    const nav = props.children.map((c) => <li key={c.text} className="navigationItem"><Link to={c.link}>{c.text}</Link></li>);

    return (
        <nav>
            <ul className="navigationContainer">
                <li className="navigationLogoContainer"><img className="navigationLogo" src={Logo} /></li>
                {nav}
            </ul>
        </nav>
    );
}