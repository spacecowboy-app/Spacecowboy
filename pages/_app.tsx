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

"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import Head from "next/head";
import log from "loglevel";
import { StrictMode, useContext, useMemo } from "react";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";

import Configuration from "@/Configuration";
import createAppTheme from "@/theme";
import Layout from "@/components/Layout";
import { ThemeVariantProvider, ThemeVariantContext } from "@/model/context/ThemeVariantContext";
import { SessionProvider } from "@/model/context/SessionContext";

import "../styles/globals.css";


// TODO: Fix hardcoded loglevel
log.setLevel(log.levels.TRACE);

log.info(`App version ${Configuration.AppVersion}`);
log.info(`API base ${Configuration.ApiBase}`)


export default function App({ Component, router, pageProps }: AppProps): JSX.Element
{
    return (
        <>
            <Head>
                <title>Spacecowboy</title>
                <meta name="description" content="Spacecowboy : Quick decisions" key="description" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta property="og:title" content="Spacecowboy : Quick decisions" key="title" />
                <meta property="og:type" content="website" key="type" />
                <meta property="og:url" content="https://spacecowboy.app" key="url" />
                <meta property="og:image" content="https://spacecowboy.app/thumbnail.png" key="image" />
                <link rel="apple-touch-icon" href="/logo192.png" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <StrictMode>
                    <ThemeVariantProvider>
                        <SessionProvider>
                            <StatefulApp Component={Component} router={router} pageProps={pageProps} />
                        </SessionProvider>
                    </ThemeVariantProvider>
                </StrictMode>
            </main>
        </>
    )
}


function StatefulApp({ Component, pageProps }: AppProps): JSX.Element
{
    const themeVariant = useContext(ThemeVariantContext) ?? "light";
    const theme = useMemo(() => createAppTheme(themeVariant), [ themeVariant ]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
                <Layout>
                    <Component {...pageProps} />
                </Layout>
        </ThemeProvider>
    );
}
