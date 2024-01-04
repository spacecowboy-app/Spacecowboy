/*
    Copyright 2021-2024 Rolf Michelsen and Tami Weiss

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
    /** Name of currently selected category. */
    value: string,

    /** Categories that can be selected. */
    categories: string[],

    /** Suppress component if only a single category is available. */
    suppressIfSingle?: boolean,

    /** Callback that will be invoked when a category is selected. */
    categorySelected?: (value: string) => void,
}


/**
 * Category selector.
 * This component supports selecting one of several categories.  It is used for selecting card deck types,
 * charm categories and possibly other categories.  The selector component may optionally be
 * suppressed if there is only a single category available.
 */
export default function CategorySelector(props: Props): JSX.Element
{
    const [category, setCategory] = useState<string>(props.value);

    if (props.suppressIfSingle && props.categories.length < 2) {
        return (<></>);
    }

    if (!props.categories.some(c => c == props.value)) {
        log.error(`Selected category ${props.value} does not exist among ${props.categories.length} provided categories.`)
        return (<></>);
    }

    return (
        <Select value={category} onChange={handleChange}>
            { props.categories.map(n => (<MenuItem key={n} value={n}>{n}</MenuItem>))  }
        </Select>
    );


    function handleChange(event: SelectChangeEvent)
    {
        const category = event.target.value as string;
        setCategory(category);
        if (props.categorySelected) {
            props.categorySelected(category);
        }
    };
}
