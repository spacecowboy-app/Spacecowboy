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

import React, { useContext } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";

import Image from "next/image";
import Link from "next/link"
import { useRouter } from "next/router";

import Logo from "@/images/logo.png";
import ThemeSelector from "@/components/ThemeSelector";
import { ServiceEventsContext } from "@/service/ServiceEvents";


export default function ApplicationHeader(): JSX.Element
{
    const router = useRouter();
    const sessionId = router.query.session as string;
    const serviceEvents = useContext(ServiceEventsContext);

    return (
        <>
            <Box sx={{ flexGrow: 1}} >
                <AppBar position="static" >
                    <Toolbar>
                        <IconButton href="/" LinkComponent={Link} size="large" edge="start" color="inherit" >
                            <Image src={Logo} width={32} alt="Logo" />
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }} ></Box>
                        { sessionId && <Button key="share" color="inherit" href={`/${sessionId}/share`} LinkComponent={Link}>Share</Button> }
                        { sessionId && <Button key="leave" color="inherit" onClick={() => leaveSession()} >Leave</Button> }
                        { !sessionId && <Button key="about" color="inherit" href="/about" LinkComponent={Link}>About</Button> }
                        <ThemeSelector />
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    )


    function leaveSession(): void
    {
        serviceEvents?.Disconnect();
        router.push({ pathname:"/" });
    }
}
