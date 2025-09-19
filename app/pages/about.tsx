/*
    Copyright 2021-2025 Rolf Michelsen and Tami Weiss

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

import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import Link from "next/link";
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
        <Stack spacing={2} alignItems="center">
            <Stack alignItems="center" spacing={4} >
                <Typography variant="h1">About Space Cowboy</Typography>
                <Stack alignItems="center" spacing={2} >
                    <Typography align="center">Play on mobile, desktop, anywhere you like.</Typography>
                    <Typography align="center">If you are running the game remotely, make sure your communication channels have voice or chat for conversation with your team.</Typography>
                </Stack>
            </Stack>
            <Stack alignItems="center" spacing={4} >
                <Typography variant="h2">Starting the Game</Typography>
                <Grid direction="row" spacing={4} container columns={{xs:1, sm:2, md:5}} >
                    <Grid xs={1}>
                        <Stack alignItems="center">
                            <Image src={DestionationImage} alt="destination" />
                            <Typography align="center">name your destination</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={1}>
                        <Stack alignItems="center">
                            <Image src={SelectDeckImage} alt="destination" />
                            <Typography align="center">select the deck</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={1}>
                        <Stack alignItems="center">
                            <Image src={SelectAvatarImage} alt="destination" />
                            <Typography align="center">select your avatar</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={1}>
                        <Stack alignItems="center">
                            <Image src={ShareLinkImage} alt="destination" />
                            <Typography align="center">share the link</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={1}>
                        <Stack alignItems="center">
                            <Image src={ShowdownImage} alt="destination" />
                            <Typography align="center">tell your story and start the showdown</Typography>
                        </Stack>
                    </Grid>
                </Grid>
                <Typography align="center">Continue the game until you have made all your decisions.</Typography>
            </Stack>
            <Stack alignItems="center" spacing={4} >
                <Typography variant="h2">Playing the Game</Typography>
                <Stack alignItems="center" spacing={2} >
                    <Typography align="center">A player reads the story to the team and then starts the round.</Typography>
                    <Typography align="center">Everyone individually thinks through the decision and selects a card.</Typography>
                    <Typography align="center">When all cards are received the cards are then revealed to everyone.</Typography>
                    <Typography align="center">Players can discuss and run the round again or start the next story.</Typography>
                </Stack>
            </Stack>
            <Stack alignItems="center" spacing={4} >
                <Typography variant="h1">Ready to Play?</Typography>
                <Button variant="contained" href="/start" LinkComponent={Link} >start a game</Button>
            </Stack>
        </Stack>
    );
}