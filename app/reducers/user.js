import { combineReducers } from 'redux';
import * as types from '../types';

const authenticated = ( state = false, action ) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS_USER:
    case types.SIGNUP_SUCCESS_USER:
    case types.LOGOUT_ERROR_USER:
      return true;
    case types.LOGIN_ERROR_USER:
    case types.SIGNUP_ERROR_USER:
    case types.LOGOUT_SUCCESS_USER:
      return false;
    default:
      return state;
  }
};

const userReducer = combineReducers({
  authenticated,
  /*
  User data is passed from redux stores on the backend.
  No actions will modify this for security purposes, for now.
  Without this, redux will warn you and users who could identify minified auth data.
  */
  name: (s = '') => s,
  netID: (s = '') => s,
  email: (s = '') => s,
  auth: (s = {}) => s
});

export default userReducer;
