// Import Actions
import { TOGGLE_ADD_POST } from './TemplateActions'

// Initial State
const initialState = {
  showAddPost: false
}

const TemplateReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_ADD_POST:
      return {
        showAddPost: !state.showAddPost
      }

    default:
      return state
  }
}

/* Selectors */

// Get showAddPost
export const getShowAddPost = state => state.template.showAddPost

// Export Reducer
export default TemplateReducer
