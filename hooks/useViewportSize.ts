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

import { useEffect, useState } from "react";


interface ViewportSize {
    width: number,
    height: number
}


/**
 * Hook to provide the viewport size.
 */
export default function useViewportSize(): ViewportSize
{
    const [ viewportSize, setViewportSize ] = useState<ViewportSize>();

    useEffect(() => {
        function handleResize() {
            setViewportSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return viewportSize ?? { width: 0, height: 0};
}
