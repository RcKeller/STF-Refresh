import api from './api'
import { message } from 'antd'
/* *****
ACTIONS
***** */
const updateConfigAction = (update) => {
  return { type: 'UPDATE_SITE_CONFIG', update }
}
//  THUNK
export const updateConfig = (update, options) => {
  return function (dispatch) {
    //  Redux query updates must be nullified
    options.update = () => null
    dispatch(api.patch('configs', update, options))
    .then(({ body }) => {
      dispatch(updateConfigAction(body))
      message.success('Site config updated!')
    })
    .catch(err => {
      message.error('Unable to update site configuration')
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
export default function config (state = {}, action) {
  switch (action.type) {
    case 'UPDATE_SITE_CONFIG':
      return action.update
    default: return state
  }
}
