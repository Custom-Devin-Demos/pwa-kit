/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, {useEffect, useRef} from 'react'
import {useLocation} from 'react-router-dom'
import PropTypes from 'prop-types'
import Error from '../../components/_error'
import {HTTPError} from '../../errors'
import {withCorrelationId} from '../with-correlation-id'

export const AppErrorContext = React.createContext()

const isProduction = process.env.NODE_ENV === 'production'

/**
 * @private
 */
class AppErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: props.error
        }
        this.onGetPropsError = this.onGetPropsError.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location !== this.props.location && this.state.error) {
            this.setState({error: undefined})
        }
    }

    // React's client side error boundaries
    static getDerivedStateFromError(err) {
        // Update state so the next render will show the fallback UI
        return {error: {message: err.toString(), stack: err.stack}}
    }

    onGetPropsError(err) {
        if (err instanceof HTTPError) {
            this.setState({error: {message: err.message, status: err.status, stack: err.stack}})
        } else {
            this.setState({
                error: {
                    message: err ? err.toString() : '',
                    status: 500,
                    stack: err ? err.stack : ''
                }
            })
        }
    }

    render() {
        const {children} = this.props
        const error = this.state.error
            ? {
                  message: this.state.error.message,
                  status: this.state.error.status,
                  stack: isProduction ? undefined : this.state.error.stack
              }
            : undefined

        return (
            <AppErrorContext.Provider value={{onGetPropsError: this.onGetPropsError}}>
                {error ? <Error {...error} correlationId={this.props.correlationId} /> : children}
            </AppErrorContext.Provider>
        )
    }
}

AppErrorBoundary.propTypes = {
    children: PropTypes.node,
    error: PropTypes.shape({
        message: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired
    }),
    correlationId: PropTypes.string,
    location: PropTypes.object
}

export {AppErrorBoundary as AppErrorBoundaryWithoutRouter}

const AppErrorBoundaryWithRouter = (props) => {
    const location = useLocation()
    return <AppErrorBoundary {...props} location={location} />
}

export default withCorrelationId(AppErrorBoundaryWithRouter)
