import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import user from '../reducers/user';

const isFetching = (state = false, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return true;
    case 'REQUEST_SUCCESS':
    case 'REQUEST_FAILURE':
      return false;
    default:
      return state;
  }
};

// Combine reducers with routeReducer which keeps track of
// router state
const rootReducer = combineReducers({
  routing, // react-router-redux
  form,  //  redux-form
  isFetching,
  user
});

export default rootReducer;
