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

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeOptions, ThemeProvider, createTheme } from "@mui/material/styles";
import type { AppProps } from "next/app";
import Head from "next/head";
import log from "loglevel";
import { useMemo } from "react";
import { Provider } from "react-redux";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";

import Configuration from "@/Configuration";
import Layout from "@/components/layout";
import store from "@/store/store";
import { useAppSelector } from "@/store/hooks";

import "../styles/globals.css";


// TODO: Fix hardcoded loglevel
log.setLevel(log.levels.TRACE);

const baseTheme: ThemeOptions = {
    typography: {
        fontFamily: [
            '"Poppins"',
            'Helvetica',
            'sans-serif'
        ].join(","),
        h1: {
            fontSize: "32px",
            fontWeight: "500",
            textTransform: "lowercase",
        },
        h2: {
            fontSize: "22px",
            fontWeight: "500",
        },
        h3: {
            fontSize: "14px",
            fontWeight: "500",
        },
        h4: {
            fontSize: "110%",
            fontWeight: "bold",
        },
        subtitle1: {
            fontSize: "80%",
        },
    },
};

const colorThemes = {
    light: {
        primary: {
            main: "#000000",
        },
    },
    dark: {},
};



log.info(`App version ${Configuration.AppVersion}`);
log.info(`API base ${Configuration.ApiBase}`)


export default function App({ Component, pageProps }: AppProps): JSX.Element
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
                <Provider store={store} >
                    <StatefulApp Component={Component} pageProps={pageProps} />
                </Provider>
            </main>
        </>
    )
}


function StatefulApp({ Component, pageProps }: AppProps): JSX.Element
{
    const colorTheme = useAppSelector(state => state.colorTheme.theme);

    const theme = useMemo( () => createTheme(
        {
            ...baseTheme,
            palette: {
                mode: colorTheme,
                ...(colorTheme === "light" ? colorThemes.light : colorThemes.dark)
            },
        }
    ), [ colorTheme ]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
                <Layout>
                    <Component {...pageProps} />
                </Layout>
        </ThemeProvider>
    );
}