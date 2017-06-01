/*
Weird name, stellar reasoning:
https://github.com/erikras/ducks-modular-redux
https://medium.com/front-end-hacking/structuring-react-and-redux-applications-255361d24f84
*/
import { push } from 'react-router-redux';
import { authService } from '../../../services';

export function beginLogin() {
  return { type: 'MANUAL_LOGIN_USER' };
}

export function loginSuccess(message) {
  return {
    type: 'LOGIN_SUCCESS_USER',
    message
  };
}

export function loginError(message) {
  return {
    type: 'LOGIN_ERROR_USER',
    message
  };
}

export function beginLogout() {
  return { type: 'LOGOUT_USER'};
}

export function logoutSuccess() {
  return { type: 'LOGOUT_SUCCESS_USER' };
}

export function logoutError() {
  return { type: 'LOGOUT_ERROR_USER' };
}

export function toggleLoginMode() {
  return { type: 'TOGGLE_LOGIN_MODE' };
}

export function manualLogin(data) {
  return (dispatch) => {
    dispatch(beginLogin());

    return authService().login(data)
      .then((response) => {
          dispatch(loginSuccess('You have been successfully logged in'));
          dispatch(push('/'));
      })
      .catch((err) => {
        dispatch(loginError('Oops! Invalid username or password'));
      });
  };
}

export function logOut() {
  return (dispatch) => {
    dispatch(beginLogout());

    return authService().logOut()
      .then((response) => {
          dispatch(logoutSuccess());
      })
      .catch((err) => {
        dispatch(logoutError());
      });
  };
}
