import { API, version } from './environment'
//  API Mutators are wrapped with async middleware
import { mutateAsync } from 'redux-query'

/*
FOREWARD:
This file can be a little confusing, but here's what we're doing:
A) Creating a series of methods that take the following arguments
  model: The model (proposal, report) being queried
  id: The ObjectId for an document being mutated
  query: Any queries, like 'populate'
B) Providing the proper redux-query configs
  mutateAsync() - wraps non-GET requests to emit redux actions & enable promise-chaining
    .then((res) => ...)
  options: Specifies method (defaults as post)
  transform: Assigns responses to readable props
  body: Body of the query, spread out your extra params
  update: Use the prev and next state to update redux store

  There's a lot of ES6 magic being used to ensure these are readable and efficient, but the syntax may not be familiar. String literals are being used to dynamically assign the keys of objects, the spread operator is being used to destructure objects being utilized in a query's body, etc.

Benefits:
-Consistent client-side querying w/ proper actions emitted
-Caching of responses, cancel in-flight ones when page is closed.
-One tool for querying ALL database models
-Built-in utilities for handling promise-chaining
-Automatically query when components load without polluting lifecycle methods via connectRequest().

TODO: create a querystring adapter that is API specific, packages don't work for this.

*/

/* *****
GET ALL
ex: api.getAll('proposal', { populate: 'contacts,decision' })
***** */
const getAll = (model, query) => ({
  url: `${API}/${version}/${model}/`,
  options: { method: 'GET' },
  transform: body => ({ [`${model}s`]: body }),
  body: { ...query },
  update: { [`${model}s`]: (prev, next) => next }
})

/* *****
GET by ID
ex: api.get('proposal', '594b49998dabd50e2c71762d')
***** */
const get = (model, id, query) => ({
  url: `${API}/${version}/${model}/${id}`,
  options: { method: 'GET' },
  transform: body => ({ [`${model}`]: body }),
  body: { ...query },
  update: { [`${model}`]: (prev, next) => next }
})

/* *****
CREATE: POST
Pass the object in as the body arg
ex: api.post('report', {})
***** */
const post = (model, body) => mutateAsync({
  url: `${API}/${version}/${model}`,
  options: { method: 'POST' },
  transform: body => ({ [`${model}`]: body }),
  body,
  update: { [`${model}`]: (prev, next) => next }
})

/* *****
UPDATE: PUT
ex: api.put('report', '594b49998dabd50e2c7176bf',
{ date: "2000-06-21T07:15:10.746Z" })
***** */
const put = (model, id, body) => mutateAsync({
  url: `${API}/${version}/${model}/${id}`,
  options: { method: 'PUT' },
  transform: body => ({ [`${model}`]: body }),
  body,
  update: { [`${model}`]: (prev, next) => next }
})

/* *****
UPDATE: PATCH
ex: api.put('report', '594b49998dabd50e2c7176bf',
{ date: "2000-06-21T07:15:10.746Z" })
***** */
const patch = (model, id, body, populate) => mutateAsync({
  url: `${API}/${version}/${model}/${id}`,
  options: { method: 'PATCH' },
  transform: body => ({ [`${model}`]: body }),
  body,
  update: { [`${model}`]: (prev, next) => next }
})

/* *****
DELETE
ex: api.remove('report', '594b49998dabd50e2c7176bf')
note: The 'delete' namespace is a JS keyword.
***** */
const remove = (model, id) => mutateAsync({
  url: `${API}/${version}/${model}/${id}`,
  options: { method: 'DELETE' },
  transform: body => ({ [`${model}`]: body }),
  update: { [`${model}`]: (prev, next) => next }
})

export default {
  getAll,
  get,
  post,
  put,
  patch,
  remove
}

/*
EXAMPLE IMPLEMENTATION:
@compose(
  connect(
    state => ({ proposal: state.entities.proposal }),
    dispatch => ({ api: bindActionCreators(api, dispatch)
    })
  ),
  connectRequest(() => api.get('proposal', '594b49998dabd50e2c71762d', {
    populate: 'body,decision'
  }))
)
...
render ({ proposal, api } = this.props) {
...call like any other standard function.
*/
