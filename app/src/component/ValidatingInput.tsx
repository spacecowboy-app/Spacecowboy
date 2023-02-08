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

import React, {useEffect, useRef} from "react";

import "./validatingInput.css";
import inputValidImage from "../images/checkmark.png";
import inputInvalidImage from "../images/accessdenied.png";



type Props = {
    value: string,
    isValid: boolean,
    onChange: (value: string) => void
};


/**
 * input component that shows an indicator for whether the input is valid
 */
export default function ValidatingInput(props: Props): JSX.Element
{
    const focusControl = useRef<HTMLInputElement>(null);

    useEffect(() => {
        focusControl.current?.focus();
    }, []);

    return (
        <span className="validatinginput">
            <input ref={focusControl} className="inputcontrol" value={props.value} onChange={(e) => props.onChange(e.target.value)} />
            <img src={props.isValid ? inputValidImage : inputInvalidImage} alt="" />
        </span>
    );
}