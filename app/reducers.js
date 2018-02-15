import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { entitiesReducer as db, queriesReducer as queries } from 'redux-query'
import {responsiveStateReducer as screen} from 'redux-responsive'

// import user from './views/Template/Login/ducks'
import user from './services/authentication'
import config from './services/config'

const rootReducer = combineReducers({
  //  redux-responsive (media query data in store)
  screen,
  // react-router-redux
  routing,
  //  redux-query
  //  db: Referred to as "entities" in redux-query docs, changed the namespace for readability
  db,
  queries,
  // Isomorphic reducers (authN/Z)
  user,
  config
  // Client-side reducers
})

export default rootReducer
