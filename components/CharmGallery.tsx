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

import Grid from '@mui/material/Unstable_Grid2';
import log from "loglevel";

import Charmset from "@/model/Charmset";
import Charm from "./Charm";


interface Props {
    /** Information about the currently selected charm set. */
    charms: Charmset,

    /** Callback for selecting a charm.  The parameter is the relative path to the charm image. */
    selectCharm?: (charm: string) => void,
}


export default function CharmGallery(props: Props): JSX.Element
{
    return (
        <Grid container spacing={2} >
            { props.charms.charms.map(c =>
                <Grid key={c} onClick={() => selectCharm(c)} >
                    <Charm charm={c} size={100} />
                </Grid>)
            }
        </Grid>
    );


    function selectCharm(charm: string): void
    {
        if (props.selectCharm) {
            props.selectCharm(charm);
        }
    }
}
