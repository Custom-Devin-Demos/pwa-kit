/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import PropTypes from 'prop-types'
import {render, waitFor, fireEvent} from '@testing-library/react'
import ScrollToTop from '@salesforce/retail-react-app/app/components/scroll-to-top/index'
import {MemoryRouter, useNavigate} from 'react-router-dom'

global.scrollTo = jest.fn()

const NavigateButton = ({to, testId}) => {
    const navigate = useNavigate()
    return <button data-testid={testId} onClick={() => navigate(to)} />
}
NavigateButton.propTypes = {
    to: PropTypes.string,
    testId: PropTypes.string
}

describe('ScrollToTop', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    test('calls window.scrollTo when route changes', async () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <ScrollToTop />
                <NavigateButton to="/new-url" testId="nav1" />
                <NavigateButton to="/new-url2" testId="nav2" />
            </MemoryRouter>
        )

        expect(global.scrollTo).toHaveBeenCalledTimes(1)
        expect(global.scrollTo).toHaveBeenCalledWith(0, 0)

        fireEvent.click(document.querySelector('[data-testid="nav1"]'))
        await waitFor(() => {
            expect(global.scrollTo).toHaveBeenCalledTimes(2)
        })
        expect(global.scrollTo).toHaveBeenCalledWith(0, 0)

        fireEvent.click(document.querySelector('[data-testid="nav2"]'))
        await waitFor(() => {
            expect(global.scrollTo).toHaveBeenCalledTimes(3)
        })
        expect(global.scrollTo).toHaveBeenCalledWith(0, 0)
    })
})
