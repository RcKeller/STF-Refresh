/* eslint-disable global-require */
/* *****
CLIENT-SIDE ROUTES
***** */
import React from 'react'
import { Route, IndexRoute } from 'react-router'
/* *****
CLIENT ROUTES
We're doing something called "code-splitting" here.
This takes our SPA architecture and modifies the way pages are loaded.
We still have a SPA, but JS pages unload when requested and are downloaded sequentially.
This gives us great UX on mobile and desktop with the magic of an SPA's instant responsiveness.
http://blog.mxstbr.com/2016/01/react-apps-with-pages/
***** */
// require.ensure polyfill for node
if (typeof require.ensure !== 'function') {
  require.ensure = function requireModule (deps, callback) {
    callback(require)
  }
}

 /* *****
 Hot reloader patch for async react routes to work with react-hot-reloader till
 https://github.com/reactjs/react-router/issues/2182 and
 https://github.com/gaearon/react-hot-loader/issues/288 is fixed.
 (By the way, don't use map(), it won't work)
***** */
if (process.env.NODE_ENV !== 'production') {
  require('./FrontPage/FrontPage')
  require('./FAQ/FAQ')
  require('./About/About')
  require('./ContactUs/ContactUs')
  require('./Proposals/Agreement/Agreement')
  require('./Proposals/Create/Create')
}

import Template from './Template/Template'
export default (
  <Route path='/' component={Template}>
    <IndexRoute getComponent={(nextState, cb) => {
      require.ensure([], require => { cb(null, require('./FrontPage/FrontPage').default) })
    }} />
    <Route path='/faq' getComponent={(nextState, cb) => {
      require.ensure([], require => { cb(null, require('./FAQ/FAQ').default) })
    }} />
    <Route path='/about' getComponent={(nextState, cb) => {
      require.ensure([], require => { cb(null, require('./About/About').default) })
    }} />
    <Route path='/contact' getComponent={(nextState, cb) => {
      require.ensure([], require => { cb(null, require('./ContactUs/ContactUs').default) })
    }} />
    <Route path='/proposals/agreement' getComponent={(nextState, cb) => {
      require.ensure([], require => { cb(null, require('./Proposals/Agreement/Agreement').default) })
    }} />
    <Route path='/proposals/create' getComponent={(nextState, cb) => {
      require.ensure([], require => { cb(null, require('./Proposals/Create/Create').default) })
    }} />
  </Route>
)
