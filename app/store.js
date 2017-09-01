import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
//  Redux query needs selectors as args:  https://amplitude.github.io/redux-query/
import { queryMiddleware } from 'redux-query'
export const getQueries = (state) => state.queries
export const getEntities = (state) => state.db
import { responsiveStoreEnhancer } from 'redux-responsive'

import rootReducer from './reducers'
/*
 * @param {Object} initial state to bootstrap our stores with for server-side rendering
 * @param {History Object} a history object. We use `createMemoryHistory` for server-side rendering,
 *                          while using browserHistory for client-side
 *                          rendering.
 */
export default function configureStore (initialState, history) {
  // Installs hooks that always keep react-router and redux store in sync
  const middleware = [
    thunk,
    routerMiddleware(history),
    queryMiddleware(getQueries, getEntities)
  ]
  let store
  // The below used to reference a JS module for env info.
  // That fails in isomorphic contexts. Thus, directly accessing the process env.
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    middleware.push(createLogger())
    store = createStore(rootReducer, initialState, compose(
      responsiveStoreEnhancer,
      applyMiddleware(...middleware),
      typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
    ))
  } else {
    store = createStore(rootReducer, initialState, compose(responsiveStoreEnhancer, applyMiddleware(...middleware), f => f))
  }

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('reducers', () => {
      const nextReducer = require('./reducers')

      store.replaceReducer(nextReducer)
    })
  }

  return store
}
