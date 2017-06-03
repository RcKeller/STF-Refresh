import { combineReducers } from 'redux';

const authenticated = ( state = false, action ) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS_USER':
    case 'SIGNUP_SUCCESS_USER':
    case 'LOGOUT_ERROR_USER':
      return true;
    case 'LOGIN_ERROR_USER':
    case 'SIGNUP_ERROR_USER':
    case 'LOGOUT_SUCCESS_USER':
      return false;
    default:
      return state;
  }
};
/*
User data is passed from redux stores on the backend.
No actions will modify this for security purposes, for now.
Without this, redux will warn you and users who could identify minified auth data.
*/
const name = (s = '') => s
const netID = (s = '') => s
const email = (s = '') => s
const committee = (s = {}) => s

const userReducer = combineReducers({
  /*
  User data is passed from redux stores on the backend.
  No actions will modify this for security purposes, for now.
  Without this, redux will warn you and users who could identify minified auth data.
  */
  name, netID, email,
  authenticated, committee
});

export default userReducer;
