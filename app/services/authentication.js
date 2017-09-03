import { API } from './environment'
import { mutateAsync } from 'redux-query'
//  A toast to the (lack of) user!
import { message } from 'antd'

/*
We abide loosely to ducks structure.
https://github.com/erikras/ducks-modular-redux
https://medium.com/front-end-hacking/structuring-react-and-redux-applications-255361d24f84
*/

/* *****
ACTIONS
***** */
const removeUser = (data) => {
  return { type: 'REMOVE_USER' }
}
//  THUNK
export const endSession = () => {
  return function (dispatch) {
    //  TODO: Use fetch for this.
    dispatch(mutateAsync({
      url: `${API}/sessions`,
      options: { method: 'DELETE' },
      update: {} // Handled in reducer
    }))
    .then(() => {
      dispatch(removeUser())
      message.success('Thanks for stopping by!')
    })
    .catch(err => {
      message.error('Unable to connect to Shibboleth')
      console.log(err)
    })
  }
}

/* *****
REDUCERS
For security purposes, the only way AuthN/Z data is retrieved
is from the server during rendering.
Our reducer here specifies expected data (initially none, so {} as default)
as well as means of deleting the user object.
***** */
export default function user (state = {}, action) {
  switch (action.type) {
    case 'REMOVE_USER':
      return {}
    default: return state
  }
}
