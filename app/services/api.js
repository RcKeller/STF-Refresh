import { API, version } from './environment'
//  API Mutators are wrapped with async middleware
import { requestAsync, mutateAsync } from 'redux-query'
import { plural, singular } from 'pluralize'
const endpoint = `${API}/${version}`
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

*/

const target = (model, options = {}) => {
  const mongoParams = ['query', 'populate', 'select', 'distinct', 'sort', 'skip', 'limit']
  let queryString = mongoParams.reduce((prev, key) => {
    return options[key]
      ? `${prev}${!prev ? '?' : '&'}${key}=${JSON.stringify(options[key])}`
      : prev
  }, '')
  return `${endpoint}/${singular(model)}/${options.id || ''}${queryString}`
}

//  Normalize responses. If you get an array with a single object, select that object.
const normalize = (res) => (Array.isArray(res) && res.length === 1) ? res[0] : res
// const normalizeArray = (next) => (next.length === 1 ? next[0] : next)

/* *****
GET (ALL)
***** */
const get = (model, options = {}) => ({
  url: target(model, options),
  options: { method: 'GET' },
  transform: res => ({ [model]: normalize(res) }),
  update: options.update
    ? options.update
    : { [model]: (prev, next) => next },
  force: options.force || false
})
const getAsync = (model, options = {}) => requestAsync({
  url: target(model, options),
  options: { method: 'GET' },
  transform: options.transform
    ? options.transform
    : res => ({ [model]: normalize(res) }),
  update: options.update
    ? options.update
    : { [model]: (prev, next) => next },
  force: options.force || false
})

/* *****
CREATE: POST
Pass the object in as the body arg
ex: api.post('report', {})
***** */
const post = (model, body = {}, options = {}) => mutateAsync({
  url: target(model, options),
  options: { method: 'POST' },
  transform: options.transform
    ? options.transform
    : res => ({ [model]: normalize(res) }),
  body,
  update: options.update
    ? options.update
    : { [model]: (prev, next) => next }
})

/* *****
UPDATE: PATCH
ex: api.put('report', '594b49998dabd50e2c7176bf',
{ date: "2000-06-21T07:15:10.746Z" })
***** */
const patch = (model, body = {}, options = {}) => mutateAsync({
  url: target(model, options),
  options: { method: 'PATCH' },
  transform: options.transform
    ? options.transform
    : res => ({ [model]: normalize(res) }),
  body,
  update: options.update ? options.update : { [model]: (prev, next) => next }
})

/* *****
DELETE
ex: api.remove('report', '594b49998dabd50e2c7176bf')
note: The 'delete' namespace is a JS keyword.
***** */
const remove = (model, options = {}) => mutateAsync({
  url: target(options),
  options: { method: 'DELETE' },
  transform: options.transform
    ? options.transform
    : res => ({ [model]: normalize(res) }),
  update: options.update ? options.update : { [model]: (prev, next) => next }
})

export default {
  endpoint,
  get,
  getAsync,
  post,
  patch,
  remove
}
