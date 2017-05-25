/* Main store function */
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import DevTools from './util/DevTools'
import rootReducer from './reducers'

export function configureStore (initialState = {}) {
  // Middleware and store enhancers
  const enhancers = [ applyMiddleware(thunk) ]
  // Enable DevTools only when rendering on client and during development.
  if (process.env.CLIENT && process.env.NODE_ENV === 'development') {
    enhancers.push(window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument())
  }
  const store = createStore(rootReducer, initialState, compose(...enhancers))

  // Enable Webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers').default // eslint-disable-line global-require
      store.replaceReducer(nextReducer)
    })
  }
  return store
}
