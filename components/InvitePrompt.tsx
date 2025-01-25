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

import React, { useContext } from "react";

import Typography from "@mui/material/Typography";

import Link from "next/link"

import { SessionContext } from "@/model/context/SessionContext";

/**
 * Component to prompt the user to invite additional participants to a session if the session has a single participant.
 */
export default function InvitePrompt(): JSX.Element
{
    const session = useContext(SessionContext);

    if (session.participants.length < 2) {
        return (<Typography>It is lonely here. Maybe try <Link href={`/${session.id}/share`}>inviting</Link> additional participants?</Typography>);
    }
    else {
        return (<></>);
    }
}