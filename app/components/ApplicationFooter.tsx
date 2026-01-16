/*
    Copyright 2021-2026 Rolf Michelsen and Tami Weiss

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

"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Image from "next/image";

import Configuration from "@/Configuration";

import GithubLight from "@/images/GitHub-Mark-64px.png";
import GitHubDark from "@/images/GitHub-Mark-64px-white.png";


/**
 * Render the application footer.  The footer is responsive and will not be too prominent on small screens.
 */
export default function ApplicationFooter(): JSX.Element
{
    const theme = useTheme();
    const isLargeFooter = useMediaQuery(theme.breakpoints.up("md"));
    const logo = theme.palette.mode == "dark" ? GitHubDark : GithubLight;

    if (isLargeFooter) {
        return (
            <Grid container spacing={2} borderTop={1} mt={6} mr={2} ml={2} pt={1} pb={1}>
                <Grid flexGrow={1}>
                    <Box>
                        <Typography variant="h4">Space Cowboy</Typography>
                        <Typography variant="body1" pt={1}>The place in space for fast decisions <br/> and great collaboration on the world wild web and the galaxy</Typography>
                        <Typography variant="body1" pt={1}>No warranty. No personal data collected.</Typography>
                        <Typography variant="subtitle1" pt={1} pb={0}>Copyright 2021-2026 Rolf Michelsen and Tami Weiss</Typography>
                        <Typography variant="subtitle1" pt={0}>Version {Configuration.AppVersion}</Typography>
                    </Box>
                </Grid>
                <Grid>
                    <Box>
                        <Typography variant="h4">Send feedback</Typography>
                        <Typography variant="body1" pt={1}>Space Cowboy HQ</Typography>
                        <Typography variant="body1" pb={1}>OSLO NORWAY</Typography>
                        <Link href="mailto:howdy@spacecowboy.app" variant="body1" color="text.primary" underline="hover">howdy@spacecowboy.app</Link>
                        <Box pt={0.8}>
                            <Link href="https://github.com/spacecowboy-app" >
                                <Image src={logo} alt="Github repository" width={32} />
                            </Link>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        );
    }
    else {
        return (
            <Stack borderTop={1} mt={6} pt={1} pl={2} pr={2}>
                <Typography variant="h4">Space Cowboy</Typography>
                <Typography variant="subtitle1" pt={1} pb={0}>Copyright 2021-2026</Typography>
                <Typography variant="subtitle1" pt={0} pb={0}>Rolf Michelsen and Tami Weiss</Typography>
                <Typography variant="subtitle1" pt={0}>Version {Configuration.AppVersion}</Typography>
                <Link href="mailto:howdy@spacecowboy.app" variant="subtitle1" color="text.primary" underline="hover">howdy@spacecowboy.app</Link>
            </Stack>
        );
    }
}
