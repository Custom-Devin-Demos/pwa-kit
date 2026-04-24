/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {render, waitFor} from '@testing-library/react'
import ScrollToTop from '@salesforce/retail-react-app/app/components/scroll-to-top/index'
import {MemoryRouter, useNavigate} from 'react-router-dom'

global.scrollTo = jest.fn()

let testNavigate

const NavigateHelper = () => {
    testNavigate = useNavigate()
    return null
}

describe('ScrollToTop', () => {
    beforeEach(() => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <ScrollToTop />
                <NavigateHelper />
            </MemoryRouter>
        )
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('calls window.scrollTo when route changes', async () => {
        expect(global.scrollTo).toHaveBeenCalledTimes(1)
        expect(global.scrollTo).toHaveBeenCalledWith(0, 0)

        testNavigate('/new-url')
        await waitFor(() => {
            expect(global.scrollTo).toHaveBeenCalledTimes(2)
        })
        expect(global.scrollTo).toHaveBeenCalledWith(0, 0)

        testNavigate('/new-url2')
        await waitFor(() => {
            expect(global.scrollTo).toHaveBeenCalledTimes(3)
        })
        expect(global.scrollTo).toHaveBeenCalledWith(0, 0)
    })
})
