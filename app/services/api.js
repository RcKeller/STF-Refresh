import { API, version } from './environment'
//  API Mutators are wrapped with async middleware
import { mutateAsync } from 'redux-query'

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
  body: Body of the query, spread out your extra args
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
  query: { number: props.args.number },
  join: ['contacts']
}
output:
...v1/block?query={"number":"70692"}&populate={"path":"contacts"}
*/
const adapt = (args) => {
  //  Base URL, e.g. ...host/v1/proposal/:id
  let url = `${API}/${version}/${args.model}/${args.id ? args.id : ''}`
  //  Operator to prefix query string for joins, queries, ID specification etc
  let operator = '?'
  if (args.where) {
    url = `${url}${operator}where=${JSON.stringify(args.where)}`
    operator = '&'
  }
  if (args.join) {
    url = `${url}${operator}join=${args.join}`
    operator = '&'
  }
  return url
}

//  Simple selector utils for handling plurality.
//  Args.model is the model name in plural tense. Endpoints are plural
const models = (args) => args.model
const model = (args) => args.model.slice(0, -1)

/* *****
GET ALL
ex: api.getAll('proposal', { populate: 'contacts,decision' })
***** */
const getAll = (args) => ({
  url: adapt(args),
  options: { method: 'GET' },
  transform: body => ({ [`${models(args)}`]: body }),
  update: { [`${models(args)}`]: (prev, next) => next }
})

/* *****
GET ONE
ex: api.get('proposal', '594b49998dabd50e2c71762d')
***** */
const get = (args) => ({
  url: adapt(args),
  options: { method: 'GET' },
  transform: body => ({ [`${model(args)}`]: body }),
  //  This is for a SINGLE document. Return first element if array received.
  update: { [`${model(args)}`]: (prev, next) => Array.isArray(next) ? next[0] : next }
})

/* *****
CREATE: POST
Pass the object in as the body arg
ex: api.post('report', {})
***** */
const post = (args, body) => mutateAsync({
  url: adapt(args),
  options: { method: 'POST' },
  transform: body => ({ [`${model(args)}`]: body }),
  body,
  update: { [`${model(args)}`]: (prev, next) => Array.isArray(next) ? next[0] : next }
})

/* *****
UPDATE: PUT
ex: api.put('report', '594b49998dabd50e2c7176bf',
{ date: "2000-06-21T07:15:10.746Z" })
***** */
const put = (args, body) => mutateAsync({
  url: adapt(args),
  options: { method: 'PUT' },
  transform: body => ({ [`${model(args)}`]: body }),
  body,
  update: { [`${model(args)}`]: (prev, next) => Array.isArray(next) ? next[0] : next }
})

/* *****
UPDATE: PATCH
ex: api.put('report', '594b49998dabd50e2c7176bf',
{ date: "2000-06-21T07:15:10.746Z" })
***** */
const patch = (args, body) => mutateAsync({
  url: adapt(args),
  options: { method: 'PATCH' },
  transform: body => ({ [`${model(args)}`]: body }),
  body,
  update: { [`${model(args)}`]: (prev, next) => Array.isArray(next) ? next[0] : next }
})

/* *****
DELETE
ex: api.remove('report', '594b49998dabd50e2c7176bf')
note: The 'delete' namespace is a JS keyword.
***** */
const remove = (args) => mutateAsync({
  url: adapt(args),
  options: { method: 'DELETE' },
  transform: body => ({ [`${model(args)}`]: body }),
  update: { [`${model(args)}`]: (prev, next) => Array.isArray(next) ? next[0] : next }
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

OR (updated example):

@compose(
  connect((state, props) => ({ block: state.entities.block })),
  connectRequest((props) => api.get({
    model: 'block',
    query: { number: props.args.number, year: "2017" },
    join: ['contacts']
  }))
)
*/
