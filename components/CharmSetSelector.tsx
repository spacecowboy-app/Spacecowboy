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

import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import log from "loglevel";


interface Props {
    /** Name of currently selected charm set. */
    value: string,

    /** Name of charm set. */
    charmSets: string[],

    /** Suppress component if only a single charm set is available. */
    suppressIfSingle?: boolean,

    /** Callback that will be invoked when a charm set is selected. */
    charmSetSelected?: (name: string) => void,
}


/**
 * Charm set selector.
 * This component supports selecting one of several charm sets.  The selector component may optionally be
 * suppressed if there is only a single charm set available.
 */
export default function CharmSetSelector(props: Props): JSX.Element
{
    const [charmSet, setCharmSet] = useState<string>(props.value);

    if (props.suppressIfSingle && props.charmSets.length < 2) {
        return (<></>);
    }

    if (!props.charmSets.some(c => c == props.value)) {
        log.error(`Selected charm set ${props.value} does not exist among ${props.charmSets.length} provided charm sets.`)
        return (<></>);
    }

    return (
        <Select id="charmset-select" value={charmSet} onChange={handleChange}>
            { props.charmSets.map(n => (<MenuItem key={n} value={n}>{n}</MenuItem>))  }
        </Select>
    );


    function handleChange(event: SelectChangeEvent)
    {
        const charmSet = event.target.value as string;
        setCharmSet(charmSet);
        if (props.charmSetSelected) {
            props.charmSetSelected(charmSet);
        }
    };
}
