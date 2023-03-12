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

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import DestionationImage from "@/images/about/destination.png";
import SelectDeckImage from "@/images/about/selectdeck.png";
import SelectAvatarImage from "@/images/about/selectavatar.png";
import ShareLinkImage from "@/images/about/sharelink.png";
import ShowdownImage from "@/images/about/showdown.png";



export default function About(): JSX.Element
{
    return (
        <Stack spacing={2} alignItems="center" >
            <Stack alignItems="center" spacing={4} >
                <Typography variant="h1">About Space Cowboy</Typography>
                <Typography>
                    Play on mobile, desktop, anywhere you like. If you are running the game remotely, make sure your communication channels have voice or chat for conversation with your team.
                </Typography>
            </Stack>
            <Stack alignItems="center" spacing={4} >
                <Typography variant="h2">Starting the Game</Typography>
                <Stack direction="row" spacing={4} >
                    <Stack alignItems="center">
                        <Image src={DestionationImage} alt="destination" />
                        <Typography>name your destination</Typography>
                    </Stack>
                    <Stack alignItems="center">
                        <Image src={SelectDeckImage} alt="destination" />
                        <Typography>select the deck</Typography>
                    </Stack>
                    <Stack alignItems="center">
                        <Image src={SelectAvatarImage} alt="destination" />
                        <Typography>select your avatar</Typography>
                    </Stack>
                    <Stack alignItems="center">
                        <Image src={ShareLinkImage} alt="destination" />
                        <Typography>share the link</Typography>
                    </Stack>
                    <Stack alignItems="center">
                        <Image src={ShowdownImage} alt="destination" />
                        <Typography>tell your story and start the showdown</Typography>
                    </Stack>
                </Stack>
                <Typography>Continue the game until you've made all your decisions.</Typography>
            </Stack>
            <Stack alignItems="center" spacing={4} >
                <Typography variant="h2">Playing the Game</Typography>
                <Typography>
                    A player reads the story to the team and then starts the round
                    Everyone individually thinks through the decision and selects a card
                    When all cards are received the cards are then revealed to everyone
                    Players can discuss and run the round again or start the next story
                </Typography>
            </Stack>
            <Stack alignItems="center" spacing={4} >
                <Typography variant="h1">Ready to Play?</Typography>
                <Button variant="contained" href="/start">start a game</Button>
            </Stack>
        </Stack>
    );
}