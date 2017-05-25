/** Root Reducer */
import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form';

// import posts from './modules/Post/PostReducer'

//  Create the rooot reducer.
export default combineReducers({
  form, // Redux-Form requirement.
  // posts
})
