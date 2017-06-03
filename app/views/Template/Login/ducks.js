/*
Weird name, stellar reasoning:
https://github.com/erikras/ducks-modular-redux
https://medium.com/front-end-hacking/structuring-react-and-redux-applications-255361d24f84
*/

/* *****
ACTIONS
***** */
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

/* *****
REDUCERS
***** */
import { combineReducers } from 'redux'

const authenticated = (state = false, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS_USER':
    case 'SIGNUP_SUCCESS_USER':
    case 'LOGOUT_ERROR_USER':
      return true
    case 'LOGIN_ERROR_USER':
    case 'SIGNUP_ERROR_USER':
    case 'LOGOUT_SUCCESS_USER':
      return false
    default:
      return state
  }
}
/*
User data is passed from redux stores on the backend.
No actions will modify this for security purposes, for now.
Without this, redux will warn you and users who could identify minified auth data.
*/
const name = (s = '') => s
const netID = (s = '') => s
const email = (s = '') => s
const committee = (s = {}) => s

export default combineReducers({
  name,
  netID,
  email,
  authenticated,
  committee
})
