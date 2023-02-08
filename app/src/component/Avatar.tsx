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

import Constants from "../Constants";

import "./Avatar.css";


type Props = {
    name?: string;
    charm?: string;
    big?: boolean;
    hover?: boolean;
};


/**
 * Component representing an avatar.
 */
export default function Avatar(props: Props): JSX.Element
{
    const img = props.charm ? <img className="avatarcharm" src={Constants.CharmsPath + props.charm} alt=""/> : <></>;
    const name = props.name ? <>{props.name}</> : <></>;
    const classname = (props.big ? "dotbig" : "dot") + " avatarbackground";
    return(
        <div className={`avatar ${props.hover === true ? "avatarhover" : ""}`} >
            <div className={classname}>
                <span className="alignhelper"></span>{img}
            </div>
            <div className="avatarname">
                {name}
            </div>
        </div>
    );
}
