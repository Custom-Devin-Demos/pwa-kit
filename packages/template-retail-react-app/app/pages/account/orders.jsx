/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import {Routes, Route} from 'react-router-dom'
import OrderHistory from '@salesforce/retail-react-app/app/pages/account/order-history'
import OrderDetail from '@salesforce/retail-react-app/app/pages/account/order-detail'

const AccountOrders = () => {
    return (
        <Routes>
            <Route index element={<OrderHistory />} />
            <Route path=":orderNo" element={<OrderDetail />} />
        </Routes>
    )
}

AccountOrders.getTemplateName = () => 'account-order-history'

export default AccountOrders
