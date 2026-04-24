/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {useQueryClient} from '@tanstack/react-query'
import {render, screen, waitFor} from '@testing-library/react'
import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import Refresh from './index'
import {getRouterBasePath} from '../../utils'

jest.useFakeTimers()

const referrerURL = 'some-url'
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => {
    return {
        useNavigate: jest.fn(() => mockNavigate),
        useLocation: jest.fn(() => ({
            search: `?referrer=${referrerURL}`
        }))
    }
})

jest.mock('@tanstack/react-query', () => {
    const invalidateQueries = jest.fn()
    return {
        useQueryClient: jest.fn(() => ({
            invalidateQueries
        }))
    }
})

jest.mock('../../utils', () => ({
    getRouterBasePath: jest.fn(() => '')
}))

beforeEach(() => {
    mockNavigate.mockClear()
})

test('renders a loading spinner initially', () => {
    render(<Refresh />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
})

test('wait for react-query cache to be invalidated', async () => {
    render(<Refresh />)

    await waitFor(() => {
        expect(useQueryClient().invalidateQueries).toHaveBeenCalled()
    })
})

test('a project not using react-query', async () => {
    // If customer project does not use react-query, calling useQueryClient would throw an error
    useQueryClient.mockImplementationOnce(() => {
        throw new Error()
    })
    render(<Refresh />)
    jest.runAllTimers()

    await waitFor(() => {
        // Expect to still continue despite the project not using react-query,
        // specifically continue to navigate back to the referrer.
        expect(mockNavigate).toHaveBeenCalledWith(referrerURL, {replace: true})
    })
})

test('wait for soft navigation to the referrer', async () => {
    render(<Refresh />)
    jest.runAllTimers()

    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(referrerURL, {replace: true})
    })
})

test('navigate to homepage if `referrer` search param cannot be found in the page url', async () => {
    jest.spyOn(console, 'warn')

    useLocation.mockImplementationOnce(() => ({
        search: ''
    }))
    render(<Refresh />)
    jest.runAllTimers()

    await waitFor(() => {
        expect(console.warn).toHaveBeenCalled()
        expect(mockNavigate).toHaveBeenCalledWith('/', {replace: true})
    })
})

test('strips base path from referrer when basePath is set', async () => {
    const basePath = '/my-base'
    getRouterBasePath.mockReturnValue(basePath)
    useLocation.mockImplementationOnce(() => ({
        search: `?referrer=${encodeURIComponent('/my-base/some-page')}`
    }))

    render(<Refresh />)
    jest.runAllTimers()

    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/some-page', {replace: true})
    })

    getRouterBasePath.mockReturnValue('')
})

test('strips base path from referrer when referrer equals basePath exactly', async () => {
    const basePath = '/my-base'
    getRouterBasePath.mockReturnValue(basePath)
    useLocation.mockImplementationOnce(() => ({
        search: `?referrer=${encodeURIComponent('/my-base')}`
    }))

    render(<Refresh />)
    jest.runAllTimers()

    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/', {replace: true})
    })

    getRouterBasePath.mockReturnValue('')
})

test('does not strip base path when referrer does not start with basePath', async () => {
    const basePath = '/my-base'
    getRouterBasePath.mockReturnValue(basePath)
    useLocation.mockImplementationOnce(() => ({
        search: `?referrer=${encodeURIComponent('/other-path/page')}`
    }))

    render(<Refresh />)
    jest.runAllTimers()

    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/other-path/page', {replace: true})
    })

    getRouterBasePath.mockReturnValue('')
})
