/* *****
REDUCERS
For security purposes, the only way AuthN/Z data is retrieved
is from the server during rendering.
Our reducer here specifies expected data (initially none, so {} as default)
as well as means of deleting the user object.
***** */
export default function config (state = {}, action) {
  switch (action.type) {
    default: return state
  }
}
