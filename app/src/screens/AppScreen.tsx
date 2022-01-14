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
import { useSelector, useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";

import AppState from "../store/Store";
import { getAssetsAction, gotAssetsAction } from "../store/AssetsState";
import { loadAssets } from "../service/LoadAssets";

import AboutScreen from "./AboutScreen";
import JoinScreen from "./JoinScreen";
import LeaveScreen from "./LeaveScreen";
import NotFoundScreen from "./NotFoundScreen";
import StartScreen from "./StartScreen";
import WelcomeScreen from "./WelcomeScreen";
import ShareRoomScreen from "./ShareRoomScreen";
import RemovedScreen from "./RemovedScreen";
import DeckGalleryScreen from "./DeckGalleryScreen";

import FooterPanel from "../component/footer";
import Navigation, { NavigationItem } from "../component/navigation";
import SessionHub from "../component/sessionhub";

import "./AppScreen.css";


/**
 * App container and maintaner of all major application state
 */
export default function AppScreen(): JSX.Element
{
    const dispatch = useDispatch();

    const decks = useSelector((state: AppState) => state.assets.decks);
    const sessionId = useSelector((state: AppState) => state.session.id);

    // Load app assets
    useEffect(() => {
        const load = async () => {
            dispatch(getAssetsAction());
            const assets = await loadAssets();
            if (assets !== null) {
                dispatch(gotAssetsAction(assets.decks, assets.charms));
            }
        };
        if (decks.length === 0) {
            load();
        }
    });

    return (
        <div className="appcontainer">
            <div className="topbarcontainer">
                <Navigation>
                    {buildNav()}
                </Navigation>
            </div>
            <div className="screencontainer">
                <Switch>
                    <Route exact path="/">
                        <WelcomeScreen />
                    </Route>
                    <Route path="/start">
                        <StartScreen />
                    </Route>
                    <Route path="/join">
                        <JoinScreen />
                    </Route>
                    <Route path="/about">
                        <AboutScreen />
                    </Route>
                    <Route path="/decks">
                        <DeckGalleryScreen />
                    </Route>
                    <Route path="/:sessionId/share">
                        <ShareRoomScreen />
                    </Route>
                    <Route path="/:sessionId/leave">
                        <LeaveScreen />
                    </Route>
                    <Route path="/:sessionId/removed">
                        <RemovedScreen />
                    </Route>
                    <Route path="/:sessionId/notfound">
                        <NotFoundScreen />
                    </Route>
                    <Route path="/:sessionId">
                        <SessionHub />
                    </Route>
                </Switch>
            </div>
            <div className="footercontainer">
                <FooterPanel />
            </div>
        </div>
    );


    function buildNav(): NavigationItem[]
    {
        const nav: NavigationItem[] = [];
        if (sessionId) {
            nav.push({link:`/${sessionId}/share`, text:"Share"});
            nav.push({link:`/${sessionId}/leave`, text:"Leave"});
        }
        else {
            nav.push({link:"/", text:"Home"});
        }
        nav.push({link:"/about", text:"About"});
        nav.push({link:"/decks", text:"Deck gallery"});
        return nav;
    }

}
