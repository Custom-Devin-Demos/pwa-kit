/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import {render} from '@testing-library/react'
import {MemoryRouter, Routes, Route, useLocation} from 'react-router-dom'
import {StaticRouter} from 'react-router-dom/server'
import RedirectWithStatus from './index'
import {SSRRedirectContext} from '../../contexts'

const LocationDisplay = () => {
    const location = useLocation()
    return <div data-testid="location">{location.pathname}</div>
}

describe('RedirectWithStatus', () => {
    test('Redirects if no status or context is provided', () => {
        const targetUrl = '/target'
        const {getByTestId} = render(
            <MemoryRouter initialEntries={['/redirect']}>
                <Routes>
                    <Route path="/redirect" element={<RedirectWithStatus to={targetUrl} />} />
                    <Route path="/target" element={<div>Target</div>} />
                </Routes>
                <LocationDisplay />
            </MemoryRouter>
        )
        expect(getByTestId('location').textContent).toBe(targetUrl)
    })
    test('Redirect renders with correct status', async () => {
        const ssrRedirectContext = {}
        const status = 303
        const targetUrl = '/target'

        render(
            <SSRRedirectContext.Provider value={ssrRedirectContext}>
                <StaticRouter location="/redirect">
                    <Routes>
                        <Route
                            path="/redirect"
                            element={<RedirectWithStatus status={status} to={targetUrl} />}
                        />
                        <Route path="/target" element={<div>Target</div>} />
                    </Routes>
                </StaticRouter>
            </SSRRedirectContext.Provider>
        )

        expect(ssrRedirectContext.status).toBe(status)
        expect(ssrRedirectContext.url).toBe(targetUrl)
    })
})
