import { API } from './environment'
import { mutateAsync } from 'redux-query'
//  A toast to the (lack of) user!
import { message } from 'antd'

/*
Weird name, stellar reasoning:
https://github.com/erikras/ducks-modular-redux
https://medium.com/front-end-hacking/structuring-react-and-redux-applications-255361d24f84
*/

/* *****
ACTIONS
***** */
export function logOut () {
  return { type: 'LOG_OUT' }
}

/* *****
API HOOKS
Use redux-query for async mutations
***** */
const endSession = () => mutateAsync({
  url: `${API}/sessions`,
  options: { method: 'DELETE' },
  update: { user: {} }
})

/* *****
REDUCERS
For security purposes, the only way AuthN/Z data is retrieved
is from the server during rendering. Our reducers can specify expected data, but not provide robust reducers.
Without this, redux will warn you and users, who could identify minified auth data.
***** */
export default function user (state = {}, action) {
  switch (action.type) {
    case 'LOG_OUT':
      endSession()
      message.success('Thanks for stopping by!')
      return {}
    default: return state
  }
}
