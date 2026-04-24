/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import {MemoryRouter} from 'react-router-dom'
import {useShopperContext, useShopperContextsMutation} from '@salesforce/commerce-sdk-react'

import {renderWithProviders} from '@salesforce/retail-react-app/app/utils/test-utils'
import {useUpdateShopperContext} from '@salesforce/retail-react-app/app/hooks/use-update-shopper-context'

const usid = 'test-usid'
jest.mock('@salesforce/commerce-sdk-react', () => {
    const originalModule = jest.requireActual('@salesforce/commerce-sdk-react')
    return {
        ...originalModule,
        useUsid: jest.fn().mockReturnValue({usid}),
        useShopperContext: jest.fn(),
        useShopperContextsMutation: jest.fn()
    }
})

const createShopperContext = {mutateAsync: jest.fn()}
const updateShopperContext = {mutateAsync: jest.fn()}
useShopperContextsMutation.mockImplementation((param) => {
    if (param === 'createShopperContext') {
        return createShopperContext
    } else if (param === 'updateShopperContext') {
        return updateShopperContext
    }
})

afterEach(() => {
    jest.clearAllMocks()
})

describe('useShopperContextSearchParams', () => {
    const MockComponent = () => {
        useUpdateShopperContext()
        return
    }

    test('does not create/update the shopper context when no shopper context search params are present', () => {
        useShopperContext.mockReturnValue({data: undefined, isLoading: false})
        renderWithProviders(
            <MemoryRouter initialEntries={['/test/path']}>
                <MockComponent />
            </MemoryRouter>
        )
        expect(useShopperContext).toHaveBeenCalledTimes(1)
        expect(createShopperContext.mutateAsync).not.toHaveBeenCalled()
        expect(updateShopperContext.mutateAsync).not.toHaveBeenCalled()
    })

    test('does not create/update the shopper context when isLoading is true', () => {
        useShopperContext.mockReturnValue({data: undefined, isLoading: true})
        renderWithProviders(
            <MemoryRouter initialEntries={['/test/path']}>
                <MockComponent />
            </MemoryRouter>
        )
        expect(useShopperContext).toHaveBeenCalledTimes(1)
        expect(createShopperContext.mutateAsync).not.toHaveBeenCalled()
        expect(updateShopperContext.mutateAsync).not.toHaveBeenCalled()
    })

    test('does not create/update the shopper context when current the shopper context deep equals the updateShopperContextObj', () => {
        useShopperContext.mockReturnValue({
            data: {sourceCode: 'instagram', geoLocation: {city: 'Toronto'}},
            isLoading: false
        })
        renderWithProviders(
            <MemoryRouter initialEntries={['/test/path/?sourceCode=instagram&city=Toronto']}>
                <MockComponent />
            </MemoryRouter>
        )
        expect(useShopperContext).toHaveBeenCalledTimes(1)
        expect(createShopperContext.mutateAsync).not.toHaveBeenCalled()
        expect(updateShopperContext.mutateAsync).not.toHaveBeenCalled()
    })

    test('creates shopper context when shopper context is undefined', () => {
        useShopperContext.mockReturnValue({data: undefined, isLoading: false})
        renderWithProviders(
            <MemoryRouter initialEntries={['/test/path/?sourceCode=instagram']}>
                <MockComponent />
            </MemoryRouter>
        )
        expect(createShopperContext.mutateAsync).toHaveBeenCalledWith({
            parameters: {usid, siteId: 'site-1'},
            body: {sourceCode: 'instagram'}
        })
    })

    test('updates shopper context when shopper context is an empty object', () => {
        useShopperContext.mockReturnValue({data: {}, isLoading: false})
        renderWithProviders(
            <MemoryRouter initialEntries={['/test/path/?sourceCode=instagram']}>
                <MockComponent />
            </MemoryRouter>
        )
        expect(updateShopperContext.mutateAsync).toHaveBeenCalledWith({
            parameters: {usid, siteId: 'site-1'},
            body: {sourceCode: 'instagram'}
        })
    })

    test('updates shopper context when shopper context is an object with values', () => {
        useShopperContext.mockReturnValue({data: {sourceCode: 'facebook'}, isLoading: false})
        renderWithProviders(
            <MemoryRouter initialEntries={['/test/path/?sourceCode=instagram']}>
                <MockComponent />
            </MemoryRouter>
        )
        expect(updateShopperContext.mutateAsync).toHaveBeenCalledWith({
            parameters: {usid, siteId: 'site-1'},
            body: {sourceCode: 'instagram'}
        })
    })
})
