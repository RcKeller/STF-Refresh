/* eslint-disable global-require */
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Template from './views/Template/Template'

// require.ensure polyfill for node
if (typeof require.ensure !== 'function') {
  require.ensure = function requireModule (deps, callback) {
    callback(require)
  }
}

/* Workaround for async react routes to work with react-hot-reloader till
  https://github.com/reactjs/react-router/issues/2182 and
  https://github.com/gaearon/react-hot-loader/issues/288 is fixed.
 */
if (process.env.NODE_ENV !== 'production') {
  // Require async routes only in development for react-hot-reloader to work.
  require('./views/FrontPage/FrontPage')
  require('./views/FAQ/FAQ')
  require('./views/About/About')
  require('./views/ContactUs/ContactUs')
  require('./views/Proposals/pages/Agreement/Agreement')
  require('./views/Proposals/pages/Create/Create')
}

// react-router setup with code-splitting
// More info: http://blog.mxstbr.com/2016/01/react-apps-with-pages/
export default (
  <Route path='/' component={Template}>
    <IndexRoute getComponent={(nextState, cb) => {
      require.ensure([], require => { cb(null, require('./views/FrontPage/FrontPage').default) })
    }} />
    <Route path='/faq' getComponent={(nextState, cb) => {
      require.ensure([], require => { cb(null, require('./views/FAQ/FAQ').default) })
    }} />
    <Route path='/about' getComponent={(nextState, cb) => {
      require.ensure([], require => { cb(null, require('./views/About/About').default) })
    }} />
    <Route path='/contact' getComponent={(nextState, cb) => {
      require.ensure([], require => { cb(null, require('./views/ContactUs/ContactUs').default) })
    }} />
    <Route path='/proposals/agreement' getComponent={(nextState, cb) => {
      require.ensure([], require => { cb(null, require('./views/Proposals/pages/Agreement/Agreement').default) })
    }} />
    <Route path='/proposals/create' getComponent={(nextState, cb) => {
      require.ensure([], require => { cb(null, require('./views/Proposals/pages/Create/Create').default) })
    }} />
  </Route>
)
