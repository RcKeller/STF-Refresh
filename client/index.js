/* *****
INDEX- ENTRY POINT
***** */
import React from 'react'
import { render } from 'react-dom'

/* *****
INITIALIZE ISOMORPHIC APP
Server provides initial state to pages, via window object.
The server also provides page metadata and bundle links.
***** */
import { AppContainer } from 'react-hot-loader'
import ReduxApp from './flux/ReduxApp'
import { configureStore } from './flux/store'
const store = configureStore(window.__INITIAL_STATE__)
render(<AppContainer><ReduxApp store={store} /></AppContainer>, document.getElementById('root'))

/* *****
Hot-Reloading App Storage
If you use Webpack 2 in ES modules mode, you can
use <App /> here rather than require() a <NextApp />.
BUG: ESModules (tree shaking) bugs out horribly, don't try it w/ this webpack ver.
***** */
if (module.hot) {
  module.hot.accept('./flux/ReduxApp', () => {
    const NextApp = require('./flux/ReduxApp').default // eslint-disable-line global-require
    render(<AppContainer><NextApp store={store} /></AppContainer>, document.getElementById('root'))
  })
}

/* *****
INITIALIZE STYLES AND THEMES
Import global styles, using require() to apply them.
Note, this only works for the config/* directory.
***** */
require('../config/style/normalize.css')
require('../config/style/main.css')
import '../config/style/ant-theme.less'
