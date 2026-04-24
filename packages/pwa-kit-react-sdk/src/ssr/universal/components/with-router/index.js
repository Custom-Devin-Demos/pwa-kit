/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import hoistNonReactStatic from 'hoist-non-react-statics'

/**
 * A shim for the removed `withRouter` HOC from React Router v5.
 * Provides `location`, `match` (with `params`), and `navigate` as props.
 *
 * @private
 */
export function withRouter(Component) {
    function ComponentWithRouter(props) {
        const location = useLocation()
        const navigate = useNavigate()
        const params = useParams()
        const match = {params: params || {}}

        return (
            <Component
                {...props}
                location={location}
                navigate={navigate}
                match={match}
                params={params}
            />
        )
    }

    const wrappedName = Component.displayName || Component.name || 'Component'
    ComponentWithRouter.displayName = `withRouter(${wrappedName})`
    hoistNonReactStatic(ComponentWithRouter, Component)
    return ComponentWithRouter
}
