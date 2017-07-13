import { API, version } from './environment'
//  API Mutators are wrapped with async middleware
import { mutateAsync } from 'redux-query'
import pluralize from 'pluralize'

/*
https://amplitude.github.io/redux-query/#/
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
  body: Body of the query, spread out your extra options
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

/*
Query string adapter
NOTE: This is a temp solution while we work on the DB migration.
input:
{
  query: { number: props.options.number },
  join: ['contacts']
}
output:
...v1/block?query={"number":"70692"}&populate={"path":"contacts"}
*/
const endpoint = (model, options) => {
  //  Base URL, e.g. ...host/v1/proposals/:id
  let url = `${API}/${version}/${pluralize(model)}/${options.id ? options.id : ''}`
  //  Operator to prefix query string for joins, queries, ID specification etc
  let operator = '?'
  if (options.where) {
    url = `${url}${operator}where=${JSON.stringify(options.where)}`
    operator = '&'
  }
  if (options.join) {
    url = `${url}${operator}join=${options.join}`
    operator = '&'
  }
  return url
}

//  Normalize responses. If you get an array with a single object, select that object.
const normalize = (res) => (Array.isArray(res) && res.length === 1) ? res[0] : res
// const normalizeArray = (next) => (next.length === 1 ? next[0] : next)

/* *****
GET (ALL)
ex: api.get('proposal', '594b49998dabd50e2c71762d')
***** */
/* *****
GET ALL
ex: api.getAll('proposal', { populate: 'contacts,decision' })
***** */
const get = (model, options = {}) => ({
  url: endpoint(model, options),
  options: { method: 'GET' },
  transform: res => ({ [model]: normalize(res) }),
  update: options.update ? options.update : { [model]: (prev, next) => next }
})

/* *****
CREATE: POST
Pass the object in as the body arg
ex: api.post('report', {})
***** */
const post = (model, body, options = {}) => mutateAsync({
  url: endpoint(model, options),
  options: { method: 'POST' },
  transform: res => ({ [model]: normalize(res) }),
  body,
  update: options.update ? options.update : { [model]: (prev, next) => next }
})

/* *****
UPDATE: PUT
ex: api.put('report', '594b49998dabd50e2c7176bf',
{ date: "2000-06-21T07:15:10.746Z" })
***** */
const put = (model, body, options = {}) => mutateAsync({
  url: endpoint(model, options),
  options: { method: 'PUT' },
  transform: res => ({ [model]: normalize(res) }),
  body,
  update: options.update ? options.update : { [model]: (prev, next) => next }
})

/* *****
UPDATE: PATCH
ex: api.put('report', '594b49998dabd50e2c7176bf',
{ date: "2000-06-21T07:15:10.746Z" })
***** */
const patch = (model, body, options = {}) => mutateAsync({
  url: endpoint(model, options),
  options: { method: 'PATCH' },
  transform: res => ({ [model]: normalize(res) }),
  body,
  update: options.update ? options.update : { [model]: (prev, next) => next }
})

/* *****
DELETE
ex: api.remove('report', '594b49998dabd50e2c7176bf')
note: The 'delete' namespace is a JS keyword.
***** */
const remove = (model, options = {}) => mutateAsync({
  url: endpoint(options),
  options: { method: 'DELETE' },
  transform: res => ({ [model]: normalize(res) }),
  update: options.update ? options.update : { [model]: (prev, next) => next }
})

export default {
  get,
  post,
  put,
  patch,
  remove
}

/*
EXAMPLE IMPLEMENTATION:

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

@compose(
  // Compose is a redux utility that runs an array of functions:
  //  Connect component to cached DB entities
  connect(
    state => ({ proposals: state.entities.proposals }),
    dispatch => ({ api: bindActionCreators(api, dispatch)
  ),
  connectRequest(props => api.get('proposal', {
    where: {
      year: props.params.year,
      number: props.params.number
    },
    join: ['contacts', 'decision', 'body', 'manifests', 'comments', 'amendments', 'report', 'reviews']
  }))
)

EXAMPLE FORM:
handleSubmit = (e) => {
  e.preventDefault()
  let { proposalID, user, api, form } = this.props
  form.validateFields((err, values) => {
    if (!err) {
      api.post('comments', {
        proposal: proposalID,
        user: user._id,
        ...values
      })
      .then(console.log('Updated!'))
      .catch(err => console.warn('An error occured', err)
    }
  })
}

*/
