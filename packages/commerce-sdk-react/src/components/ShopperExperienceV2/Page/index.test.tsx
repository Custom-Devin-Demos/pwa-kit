/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {render, waitFor} from '@testing-library/react'
import Page from './index'
import {HelmetProvider} from 'react-helmet-async'
import type {PageWithDesignMetadata} from '../types'

// Mock the Component to avoid registry dependency
jest.mock('../Component', () => ({
    Component: ({component}: {component: {id: string; typeId: string}}) => (
        <div data-testid={`component-${component.id}`} className="component">
            {component.typeId}
        </div>
    )
}))

// Mock the RegionWrapper
jest.mock('../Region/region-wrapper', () => ({
    RegionWrapper: ({children, className}: {children: React.ReactNode; className?: string}) => (
        <div className={`region ${className || ''}`}>{children}</div>
    )
}))

const SAMPLE_PAGE = {
    id: 'samplepage',
    typeId: 'storePage',
    aspectTypeId: 'pdpAspect',
    name: 'Sample Page',
    description: 'Sample page of the storefront.',
    pageTitle: 'title',
    pageDescription: 'description',
    pageKeywords: 'keywords',
    regions: [
        {
            id: 'regionA',
            components: [
                {
                    id: 'iofwj38fhw3f',
                    typeId: 'commerce_assets.banner',
                    data: {
                        title: 'Products On Sale',
                        bannerImage: 'sale/topsellerPromo.jpg'
                    }
                }
            ]
        },
        {
            id: 'regionB',
            components: [
                {
                    id: 'rfdvj4ojtltljw3',
                    typeId: 'commerce_assets.carousel',
                    data: {
                        title: 'Topseller',
                        category: 'topseller'
                    },
                    regions: [
                        {
                            id: 'regionB1',
                            components: [
                                {
                                    id: 'rfdvj4ojtltljw3',
                                    typeId: 'commerce_assets.carousel',
                                    data: {
                                        title: 'Topseller',
                                        category: 'topseller'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 'regionC',
            components: []
        }
    ]
} as unknown as PageWithDesignMetadata

beforeEach(() => {
    // Suppress console.log during tests
    jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
    jest.restoreAllMocks()
})

test('Page renders without errors', async () => {
    const {container} = render(
        <HelmetProvider>
            <Page page={SAMPLE_PAGE} components={{}} />
        </HelmetProvider>
    )

    // Page is in document.
    expect(container.querySelector('[id=samplepage]')).toBeInTheDocument()

    // Meta data and title are set
    await waitFor(() => {
        expect(document.title).toBe('title')
    })
    expect(document.querySelector('meta[name="description"][content="description"]')).toBeTruthy()
    expect(document.querySelector('meta[name="keywords"][content="keywords"]')).toBeTruthy()

    // Regions are in document.
    expect(container.querySelectorAll('.region')?.length).toBe(3)

    // Components are in document. (Note: Sub-regions/components aren't rendered because that is
    // the responsibility of the component definition.)
    expect(container.querySelectorAll('.component')?.length).toBe(2)
})

test('Page renders with empty page data', () => {
    const emptyPage = {
        id: 'emptypage',
        regions: []
    } as unknown as PageWithDesignMetadata
    const {container} = render(
        <HelmetProvider>
            <Page page={emptyPage} />
        </HelmetProvider>
    )

    expect(container.querySelector('[id=emptypage]')).toBeInTheDocument()
    expect(container.querySelectorAll('.region')?.length).toBe(0)
})

test('Page renders without meta tags when not provided', () => {
    const pageWithoutMeta = {
        id: 'nometa',
        regions: []
    } as unknown as PageWithDesignMetadata
    render(
        <HelmetProvider>
            <Page page={pageWithoutMeta} />
        </HelmetProvider>
    )

    expect(document.querySelector('title[data-rh="true"]')).toBeNull()
})

test('Page applies custom className', () => {
    const simplePage = {
        id: 'simplepage',
        regions: []
    } as unknown as PageWithDesignMetadata
    const {container} = render(
        <HelmetProvider>
            <Page page={simplePage} className="custom-page-class" />
        </HelmetProvider>
    )

    expect(container.querySelector('.page.custom-page-class')).toBeInTheDocument()
})
