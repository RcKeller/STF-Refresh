import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { reducer as form } from 'redux-form'

//  COMMON REDUCERS
import user from '../reducers/user'
//  COMPONENT REDUCERS

const rootReducer = combineReducers({
  routing, // react-router-redux
  form,  //  redux-form
  user
})

export default rootReducer
