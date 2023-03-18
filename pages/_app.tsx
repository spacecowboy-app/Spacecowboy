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
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { AppProps } from "next/app";
import Head from "next/head";
import log from "loglevel";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";

import Layout from "@/components/layout";

import "../styles/globals.css";


// TODO: Fix hardcoded loglevel
log.setLevel(log.levels.TRACE);

const theme = createTheme({
    palette: {
        primary: {
            main: "#000000",
        },
    },
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
});


export default function App({ Component, pageProps }: AppProps) {
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
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                </ThemeProvider>
            </main>
        </>
    )
}
