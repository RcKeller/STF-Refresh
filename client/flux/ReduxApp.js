/* *****
FLUX - IMPLEMENTING REDUX
***** */
import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'

// Import Routes
import routes from '../views/'
export default function ReduxApp (props) {
  return (
    <Provider store={props.store}>
      <Router history={browserHistory}>
        {routes}
      </Router>
    </Provider>
  )
}
ReduxApp.propTypes = { store: PropTypes.object.isRequired }
