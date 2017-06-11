import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { reducer as form } from 'redux-form'
import { entitiesReducer as entities, queriesReducer as queries } from 'redux-query'

import user from './views/Template/Login/ducks'

const rootReducer = combineReducers({
  // react-router-redux
  routing,
  //  redux-form
  form,
  //  redux-query
  entities,
  queries,
  // Isomorphic reducers (authN/Z)
  user
  // Client-side reducers
})

export default rootReducer
