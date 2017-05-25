/* *****
ROOT REDUCER
***** */
import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form';
/* Custom Reducers */
// import posts from './views/Post/PostReducer'

export default combineReducers({
  form, // Redux-Form requirement.
  // posts
})
