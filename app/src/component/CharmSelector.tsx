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

import React, { useState } from "react";

import Constants from "../Constants";
import Filter from "./filter";
import { AvatarSet } from "../model/apptypes";

import "./Avatar.css";



type Props = {
    avatars: AvatarSet[];
    handleCharmSelection: (charm: string) => void;
};


/**
 * A component for selecting a charm
 */
export default function CharmSelector(props: Props): JSX.Element
{
    const [selected, setSelected] = useState<number>(0);

    const charms = props.avatars[selected].avatars.map((avatar) =>
        <div key={avatar.image} className="dotcharm avatarbackground avatarhover">
            <span className="alignhelper"></span><img className="avatarcharm" src={Constants.CharmsPath + avatar.image} alt="" onClick={() => handleCharmSelect(avatar.image)} />
        </div>
    );

    const avatarsets = props.avatars.map(a => a.name);

    return(
        <div>
            <Filter options={avatarsets} selected={selected} selectOption={selectAvatarSer} />
            <div className="charmrow">
                <div className="charmcontainer">
                    {charms}
                </div>
            </div>
        </div>
    );


    function handleCharmSelect(charm: string): void
    {
        props.handleCharmSelection(charm);
    }


    function selectAvatarSer(selected: number): void
    {
        setSelected(selected);
    }
}
