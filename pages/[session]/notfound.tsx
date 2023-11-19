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

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Link from "next/link";
import { useRouter } from "next/router";

import HeroImage from "@/components/HeroImage";

import heroImage from "@/images/hero/noplace.png";


/**
 * Page shown when attempting to join a session that does not exist.
 * */
export default function SessionNotFound(): JSX.Element
{
    const router = useRouter();
    const sessionId = router.query.session as string;

    return (
        <Stack spacing={2} alignItems="center">
            <HeroImage src={heroImage} alt="" />
            <Typography variant="h3">The space {sessionId} does not exist</Typography>
            <Typography variant="h3">You can create it or join another</Typography>
            <Button variant="contained" href="/" LinkComponent={Link}>go back</Button>
        </Stack>
    );

}
