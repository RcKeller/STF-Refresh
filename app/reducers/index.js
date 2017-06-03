import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { reducer as form } from 'redux-form'


import user from '../views/Template/Login/ducks'

const rootReducer = combineReducers({
  routing, // react-router-redux
  form,  //  redux-form
  user
})

export default rootReducer
