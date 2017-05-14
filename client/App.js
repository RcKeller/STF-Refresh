/**
 * Root Component
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
// Import Routes
import routes from './routes'

// Base stylesheet
require('./main.css')
import 'normalize.css' // Note this
import 'antd/dist/antd.css' // Note this

export default function App (props) {
  return (
    <Provider store={props.store}>
      <Router history={browserHistory}>
        {routes}
      </Router>
    </Provider>
  )
}

App.propTypes = {
  store: PropTypes.object.isRequired
}
