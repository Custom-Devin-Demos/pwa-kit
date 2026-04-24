/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import {MemoryRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import {screen, fireEvent, waitFor} from '@testing-library/react'

import {IntlProvider} from 'react-intl'

import mockProductDetail from '@salesforce/retail-react-app/app/mocks/variant-750518699578M'
import {useProductViewModal} from '@salesforce/retail-react-app/app/hooks/use-product-view-modal'
import {
    DEFAULT_LOCALE,
    renderWithProviders
} from '@salesforce/retail-react-app/app/utils/test-utils'
import messages from '@salesforce/retail-react-app/app/static/translations/compiled/en-GB.json'
import {rest} from 'msw'

jest.mock('@salesforce/commerce-sdk-react', () => {
    const originalModule = jest.requireActual('@salesforce/commerce-sdk-react')
    return {
        ...originalModule,
        useProduct: jest.fn().mockReturnValue({isFetching: false})
    }
})

const mockProduct = {
    ...mockProductDetail,
    id: '750518699660M',
    variationValues: {
        color: 'BLACKFB',
        size: '050',
        width: 'V'
    },
    c_color: 'BLACKFB',
    c_isNew: true,
    c_refinementColor: 'black',
    c_size: '050',
    c_width: 'V'
}

const MockComponent = ({product}) => {
    const productViewModalData = useProductViewModal(product)
    const [isShown, setIsShown] = React.useState(false)

    return (
        <div>
            <button onClick={() => setIsShown(!isShown)}>Toggle the content</button>
            {isShown && (
                <>
                    <div>{productViewModalData.product.id}</div>
                    <div>{`isFetching: ${productViewModalData.isFetching}`}</div>
                </>
            )}
        </div>
    )
}

MockComponent.propTypes = {
    product: PropTypes.object
}

beforeEach(() => {
    global.server.use(
        rest.get('*/products/:productId', (req, res, ctx) => {
            return res(ctx.delay(0), ctx.json(mockProduct))
        })
    )
})

describe('useProductViewModal hook', () => {
    test('returns proper data with product and isFetching state', async () => {
        renderWithProviders(<MockComponent product={mockProductDetail} />)

        const toggleButton = screen.getByText(/Toggle the content/)
        fireEvent.click(toggleButton)

        await waitFor(() => {
            expect(screen.getByText('750518699578M')).toBeInTheDocument()
            expect(screen.getByText(/isFetching: false/i)).toBeInTheDocument()
        })
    })

    test('fetches and updates product data', async () => {
        renderWithProviders(
            <MemoryRouter initialEntries={['/test/path']}>
                <IntlProvider locale={DEFAULT_LOCALE} defaultLocale={DEFAULT_LOCALE}>
                    <MockComponent product={mockProductDetail} />
                </IntlProvider>
            </MemoryRouter>
        )

        const toggleButton = screen.getByText(/Toggle the content/)
        fireEvent.click(toggleButton)

        await waitFor(() => {
            expect(screen.getByText('750518699578M')).toBeInTheDocument()
        })
    })

    test('does not manage URL parameters (modals use React state instead)', () => {
        renderWithProviders(
            <MemoryRouter initialEntries={['/test/path?color=red&size=M']}>
                <IntlProvider
                    locale={DEFAULT_LOCALE}
                    defaultLocale={DEFAULT_LOCALE}
                    messages={messages}
                >
                    <MockComponent product={mockProductDetail} />
                </IntlProvider>
            </MemoryRouter>
        )

        const toggleButton = screen.getByText(/Toggle the content/)

        // Show the content
        fireEvent.click(toggleButton)

        // Hide the content
        fireEvent.click(toggleButton)
    })
})
