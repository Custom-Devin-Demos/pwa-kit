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
}

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
