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

import "./AboutScreen.css";
import destinationImage from "../images/about/destination.png";
import selectDeckImage from "../images/about/selectdeck.png";
import selectAvatarImage from "../images/about/selectavatar.png";
import sharePlaceImage from "../images/about/sharelink.png";
import showdownImage from "../images/about/showdown.png";


type Props = {
    setSession?: (id: string|undefined) => void;
};

/**
 * Application about screen
 */
export default function AboutScreen(props: Props): JSX.Element
{
    useEffect(() => {
        if (props.setSession) {
            props.setSession(undefined);
        }
    });

    return (
        <div className="screencontainer">
            <div className="aboutvertical lightcontainer">
                <h1 className="abouttext">about space cowboy</h1>
                <p className="abouttext">Play on mobile, desktop, anywhere you like. If you are running the game remotely, make sure your communication channels have voice or chat for conversation with your team.</p>
            </div>
            <div className="aboutvertical shadedcontainer">
                <h2 className="abouttext">starting the game</h2>
                <div className="abouthorizontal">
                    <div className="aboutstep">
                        <img src={destinationImage} alt="" />
                        <p className="abouttext">name your destination</p>
                    </div>
                    <div className="aboutstep">
                        <img src={selectDeckImage} alt="" />
                        <p className="abouttext">select the deck</p>
                    </div>
                    <div className="aboutstep">
                        <img src={selectAvatarImage} alt="" />
                        <p className="abouttext">select your avatar</p>
                    </div>
                    <div className="aboutstep">
                        <img src={sharePlaceImage} alt="" />
                        <p className="abouttext">share the link</p>
                    </div>
                    <div className="aboutstep">
                        <img src={showdownImage} alt="" />
                        <p className="abouttext">tell your story and start the showdown</p>
                    </div>
                </div>
                <p className="abouttext">continue the game until you&apos;ve made all your decisions</p>
            </div>
            <div className="aboutvertical lightcontainer">
                <h2 className="abouttext">playing the game</h2>
                <p className="abouttext">A player reads the story to the team and then starts the round</p>
                <p className="abouttext">Everyone individually thinks through the decision and selects a card</p>
                <p className="abouttext">When all cards are received the cards are then revealed to everyone</p>
                <p className="abouttext">Players can discuss and run the round again or start the next story</p>
            </div>
            <div className="aboutvertical shadedcontainer">
                <h1>ready to play?</h1>
            </div>
            <div className="buttonpanel">
                <Link to="/start" className="button">start a game</Link>
            </div>
        </div>
    );

}