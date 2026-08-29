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

import { forwardRef } from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";


type Props = Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"] };


/**
 * Client-side navigation link component.  Wraps `react-router-dom`'s `Link` component but accepts an `href` prop
 * instead of `to`, so it can be used as a drop-in replacement wherever an `href`-based link component is expected,
 * for example as the `LinkComponent` of a MUI `Button`.
 */
const Link = forwardRef<HTMLAnchorElement, Props>(function Link({ href, ...props }, ref)
{
    return <RouterLink ref={ref} to={href} {...props} />;
});

export default Link;
