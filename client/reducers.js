/**
 * Root Reducer
 */
import { combineReducers } from 'redux'

// Import Reducers
import template from './modules/Template/TemplateReducer'
import posts from './modules/Post/PostReducer'

// Combine all reducers into one root reducer
export default combineReducers({
  template,
  posts
})
