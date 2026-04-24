/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import PropTypes from 'prop-types'
import {Routes, Route} from 'react-router-dom'
import AppErrorBoundary from '../app-error-boundary'
import {UIDReset, UIDFork} from 'react-uid'

/**
 * The Switch component packages up the bits of rendering that are shared between
 * server and client-side. It's *mostly* a react-router Routes component, hence the
 * name.
 *
 * This is for internal use only.
 *
 * @private
 */
const Switch = (props) => {
    const {error, appState, routes, App} = props
    return (
        <UIDReset>
            <AppErrorBoundary error={error}>
                {!error && (
                    <App preloadedProps={appState.appProps}>
                        <Routes>
                            {routes.map((route, i) => {
                                const {component: Component, path, exact, ...routeProps} = route
                                return (
                                    <Route
                                        key={i}
                                        path={path}
                                        {...routeProps}
                                        element={
                                            <UIDFork>
                                                <Component preloadedProps={appState.pageProps} />
                                            </UIDFork>
                                        }
                                    />
                                )
                            })}
                        </Routes>
                    </App>
                )}
            </AppErrorBoundary>
        </UIDReset>
    )
}

Switch.propTypes = {
    error: PropTypes.object,
    appState: PropTypes.object,
    routes: PropTypes.array,
    App: PropTypes.func,
    preloadedProps: PropTypes.object
}

export default Switch
