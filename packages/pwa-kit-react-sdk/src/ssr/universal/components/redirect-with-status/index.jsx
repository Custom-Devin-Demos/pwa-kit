/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {useContext} from 'react'
import {Navigate} from 'react-router-dom'
import PropTypes from 'prop-types'
import {SSRRedirectContext} from '../../contexts'

/**
 * The `RedirectWithStatus` component is used to specify a different status code when redirecting via
 * the Navigate component.
 * The default redirect behavior when this component is not used is to set a 302 status.
 *
 * @param {number} status - The HTTP status code. Defaults to 302 if not specified
 * @param {string} to - The redirect's target path
 */
const RedirectWithStatus = ({status = 302, to, ...props}) => {
    const ssrRedirectContext = useContext(SSRRedirectContext)

    if (ssrRedirectContext) {
        ssrRedirectContext.status = status
        ssrRedirectContext.url =
            typeof to === 'string' ? to : `${to.pathname || ''}${to.search || ''}${to.hash || ''}`
    }

    return <Navigate to={to} replace {...props} />
}

RedirectWithStatus.propTypes = {
    status: PropTypes.number,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
}

export default RedirectWithStatus
