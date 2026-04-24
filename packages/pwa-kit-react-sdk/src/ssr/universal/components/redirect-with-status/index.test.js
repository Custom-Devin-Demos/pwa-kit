/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import {render, screen} from '@testing-library/react'
import {MemoryRouter, Routes, Route} from 'react-router-dom'
import RedirectWithStatus from './index'
import {SSRRedirectContext} from '../../contexts'

describe('RedirectWithStatus', () => {
    test('Redirects if no status or context is provided', () => {
        const targetUrl = '/target'
        render(
            <MemoryRouter initialEntries={['/redirect']}>
                <Routes>
                    <Route
                        path="/redirect"
                        element={<RedirectWithStatus to={targetUrl} />}
                    />
                    <Route path="/target" element={<div>Target reached</div>} />
                </Routes>
            </MemoryRouter>
        )
        expect(screen.getByText('Target reached')).toBeInTheDocument()
    })
    test('Redirect renders with correct status in SSR context', async () => {
        const redirectContext = {}
        const status = 303
        const targetUrl = '/target'

        render(
            <SSRRedirectContext.Provider value={redirectContext}>
                <MemoryRouter initialEntries={['/redirect']}>
                    <Routes>
                        <Route
                            path="/redirect"
                            element={
                                <RedirectWithStatus status={status} to={targetUrl} />
                            }
                        />
                    </Routes>
                </MemoryRouter>
            </SSRRedirectContext.Provider>
        )

        expect(redirectContext.status).toBe(status)
        expect(redirectContext.url).toBe(targetUrl)
    })
})
