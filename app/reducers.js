import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { entitiesReducer as db, queriesReducer as queries } from 'redux-query'
import {responsiveStateReducer as screen} from 'redux-responsive'

// import user from './views/Template/Login/ducks'
import user from './services/authentication'

const rootReducer = combineReducers({
  //  redux-responsive (media query data in store)
  screen,
  // react-router-redux
  routing,
  //  redux-query
  db, //  AKA Entities
  queries,
  // Isomorphic reducers (authN/Z)
  user
  // Client-side reducers
})

export default rootReducer
