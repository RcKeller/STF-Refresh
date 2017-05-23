/* Root Component */
import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'

require('../global-styles/normalize.css')
// Base stylesheet
require('../global-styles/main.css')
// Initialize Ant-UI Styles
import './theme.less'

// Import Routes
import routes from './routes'
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
