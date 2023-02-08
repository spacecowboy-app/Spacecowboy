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

import React, { SyntheticEvent, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import log from "loglevel";

import AvatarNameEditor from "../component/AvatarNameEdtor";
import CharmSelector from "../component/CharmSelector";

import AppState from "../store/Store";
import { setParticipantIdAction } from "../store/SessionState";
import Service from "../service/service";
import PersistentStorage from "../PersistentStorage";

import "./AvatarCreatorScreen.css";


type Params = {
    sessionId: string;
};


export default function AvatarCreatorPanel(): JSX.Element
{
    const dispatch = useDispatch();

    const {sessionId} = useParams<Params>();
    const charms = useSelector((state: AppState) => state.assets.charms);

    // The avatar name is simply the string shown next to the avatar charm
    const [avatarName, setAvatarName] = useState<string>("");

    // The filename of the image used as the avatar charm
    const [avatarCharm, setAvatarCharm] = useState<string>("");

    /* Once the charms have been loaded, select a random default charm. */
    useEffect(() => {
        if (avatarCharm === "" && charms.length > 0) {
            setAvatarCharm(charms[0].avatars[Math.floor(Math.random()*charms[0].avatars.length)].image);
        }
    }, [charms, avatarCharm]);

    if (charms.length === 0) {
        return (<>empty</>);
    }

    return (
        <form className="screencontainer" onSubmit={(e) => onSubmit(e)}>
            <div className="headerpanel">
                <h1>Select your charm</h1>
            </div>

            <AvatarNameEditor  name={avatarName} charm={avatarCharm} onNameChanged={(e: React.ChangeEvent<HTMLInputElement>): void => {setAvatarName(e.target.value);}} />

            <CharmSelector avatars={charms} handleCharmSelection={(image: string): void => { setAvatarCharm(image); }} />

            <div className="buttonpanel">
                <input className="button" type="submit" value="arrive with charm" />
            </div>
        </form>
    );


    function onSubmit(e: SyntheticEvent): void
    {
        e.preventDefault();

        Service.AddParticipant(sessionId, {name: avatarName, avatar: avatarCharm})
            .then((response) => {
                dispatch(setParticipantIdAction(response.id));
                PersistentStorage.setParticipantState({ sessionId: sessionId, participantId: response.id, participantAuthorization:"" });
                log.debug(`Select avatar name ${avatarName} and charm ${avatarCharm}.  Participant ID ${response.id}`);
            })
            .catch((error) => {
                log.error(`Unable to add participant: ${error}`);
            });
    }

}
