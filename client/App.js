/* Root Component */
import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'

// Import global styles, using require() to circumvent CSS module hashing.
// Note, this only works for the config/* directory.
require('../config/style/normalize.css')
require('../config/style/main.css')
import '../config/style/ant-theme.less'
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
App.propTypes = { store: PropTypes.object.isRequired }
