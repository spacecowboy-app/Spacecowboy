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

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import log from "loglevel";
import { JSX, useContext, useMemo } from "react";
import { Route, Routes } from "react-router-dom";

import Configuration from "@/Configuration";
import createAppTheme from "@/theme";
import Layout from "@/components/Layout";
import { ThemeVariantProvider, ThemeVariantContext } from "@/model/context/ThemeVariantContext";
import { SessionProvider, SessionDispatchContext } from "@/model/context/SessionContext";
import ServiceEvents, { ServiceEventsContext } from "@/service/ServiceEvents";

import About from "@/pages/About";
import Home from "@/pages/Home";
import JoinGame from "@/pages/JoinGame";
import Session from "@/pages/Session";
import SessionNotFound from "@/pages/SessionNotFound";
import SessionShare from "@/pages/SessionShare";
import StartGame from "@/pages/StartGame";


log.setLevel(Configuration.LogLevel());
log.info(`App version ${Configuration.AppVersion}`);
log.info(`API base ${Configuration.ApiBase}`)


export default function App(): JSX.Element
{
    return (
        <ThemeVariantProvider>
            <SessionProvider>
                <StatefulApp />
            </SessionProvider>
        </ThemeVariantProvider>
    )
}


function StatefulApp(): JSX.Element
{
    const themeVariant = useContext(ThemeVariantContext) ?? "light";
    const theme = useMemo(() => createAppTheme(themeVariant), [ themeVariant ]);

    const dispatch = useContext(SessionDispatchContext);
    const serviceEvents = new ServiceEvents(dispatch);

    return (
        <ServiceEventsContext.Provider value={serviceEvents} >
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/join" element={<JoinGame />} />
                        <Route path="/start" element={<StartGame />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/:session/share" element={<SessionShare />} />
                        <Route path="/:session/notfound" element={<SessionNotFound />} />
                        <Route path="/:session" element={<Session />} />
                    </Routes>
                </Layout>
            </ThemeProvider>
        </ServiceEventsContext.Provider>
    );
}
