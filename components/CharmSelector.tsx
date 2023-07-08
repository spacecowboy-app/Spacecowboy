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

import React, { useEffect, useState } from "react";
import log from "loglevel";

import Charmset from "@/model/Charmset";
import {getCharmsAsync} from "@/service/Service";
import CharmSetSelector from "./CharmSetSelector";


interface Props {

}


export default function CharmSelector(props: Props): JSX.Element
{
    const [charmSets, setCharmSets] = useState<Charmset[]|undefined>();
    const [currentCharmSet, setCurrentCharmSet] = useState<string|undefined>();

    /* Get all charm sets. */
    useEffect(() => {
        if (!charmSets) {
            getCharmsAsync()
                .then(result => {
                    setCharmSets(result);
                    setCurrentCharmSet(result[0].name);
                    log.debug(`Got ${result.length} charm sets.`);
                })
                .catch(() => log.error("Unable to get any charm sets."));
        }
    }, [charmSets]);

    if (!charmSets || !currentCharmSet || charmSets.length === 0) {
        return (<></>);
    }

    return (
        <>
            <CharmSetSelector charmSets={charmSets.map(c => c.name)} value={currentCharmSet} suppressIfSingle={true} />
        </>
    );
}