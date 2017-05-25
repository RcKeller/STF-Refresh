/* *****
Client-Side Index
***** */
import React from 'react'
import { render } from 'react-dom'

/* *****
Load Core Styles and Normalizers
***** */
// Import global styles, using require() to circumvent CSS module hashing without heavy hacking of webpack.
// Note, this only works for the config/* directory.
require('../config/style/normalize.css')
require('../config/style/main.css')
import '../config/style/ant-theme.less'

/* *****
Initialize App w/ Isomorphic Store
***** */
import { AppContainer } from 'react-hot-loader'
import ReduxApp from './flux/ReduxApp'
import { configureStore } from './flux/store'
const store = configureStore(window.__INITIAL_STATE__)
// Initialize store w/ initial state provided by the server.
render(
  <AppContainer>
    <ReduxApp store={store} />
  </AppContainer>,
  document.getElementById('root')
)

/* *****
Hot-Reloading App Storage
***** */
// If you use Webpack 2 in ES modules mode, you can
// use <App /> here rather than require() a <NextApp />.
if (module.hot) {
  module.hot.accept('./flux/ReduxApp', () => {
    const NextApp = require('./flux/ReduxApp').default // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextApp store={store} />
      </AppContainer>,
      document.getElementById('root')
    )
  })
}
