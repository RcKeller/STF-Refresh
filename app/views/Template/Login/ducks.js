/*
Weird name, stellar reasoning:
https://github.com/erikras/ducks-modular-redux
https://medium.com/front-end-hacking/structuring-react-and-redux-applications-255361d24f84
*/
import { push } from 'react-router-redux'
import { authService } from '../../../services'

export function beginLogout () {
  return { type: 'LOGOUT_USER'}
}

export function logoutSuccess () {
  return { type: 'LOGOUT_SUCCESS_USER' }
}

export function logoutError () {
  return { type: 'LOGOUT_ERROR_USER' }
}

export function logOut () {
  return (dispatch) => {
    dispatch(beginLogout())

    return authService().logOut()
      .then((response) => {
        dispatch(logoutSuccess())
        try { location.reload() } catch (e) { console.log('Failed to refresh post-logout') }
      })
      .catch((err) => {
        dispatch(logoutError())
      })
  }
}
