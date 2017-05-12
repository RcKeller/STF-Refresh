/* eslint-disable global-require */
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Template from './modules/Template/Template'

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
  require('./modules/FrontPage/FrontPage')
  require('./modules/FAQ/FAQ')
  require('./modules/About/About')
  require('./modules/Post/pages/PostListPage/PostListPage')
  require('./modules/Post/pages/PostDetailPage/PostDetailPage')
}

// react-router setup with code-splitting
// More info: http://blog.mxstbr.com/2016/01/react-apps-with-pages/
export default (
  <Route path='/' component={Template}>
    <IndexRoute getComponent={(nextState, cb) => {
      require.ensure([], require => {
        cb(null, require('./modules/FrontPage/FrontPage').default)
      })
    }} />
    <Route path='/faq' getComponent={(nextState, cb) => {
      require.ensure([], require => {
        cb(null, require('./modules/FAQ/FAQ').default)
      })
    }}
  />
    <Route path='/about' getComponent={(nextState, cb) => {
      require.ensure([], require => {
        cb(null, require('./modules/About/About').default)
      })
    }}
  />
    <Route path='/posts' getComponent={(nextState, cb) => {
      require.ensure([], require => {
        cb(null, require('./modules/Post/pages/PostListPage/PostListPage').default)
      })
    }}
    />
    <Route path='/posts/:slug-:cuid' getComponent={(nextState, cb) => {
      require.ensure([], require => {
        cb(null, require('./modules/Post/pages/PostDetailPage/PostDetailPage').default)
      })
    }}
    />
  </Route>
)
