import { API, version } from './environment'
//  API Mutators are wrapped with async middleware
import { mutateAsync } from 'redux-query'

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

// dispatch => ({ actions: bindActionCreators(api, dispatch)

/*
FOREWARD:
This file can be a little confusing, but here's what we're doing:
A) Creating a list of models that have restful endpoints
B) Initializing an API, which will hold methods for accessing each of those.
*/
//  TODO: create a querystring adapter that is API specific, packages don't work.

/*
GET ALL
ex: api.getAll('proposal', { populate: 'contacts,decision' })
Can use complex queries as an obj
*/
const getAll = (model, query) => ({
  url: `${API}/${version}/${model}`,
  options: { method: 'GET' },
  // Assign response to prop.
  transform: body => ({ [`${model}s`]: body }),
  body: { ...query },
  //  Apply queries e.g. { populate: 'contacts,decision' }
  //  Update the models with next state
  update: { [`${model}s`]: (prev, next) => next }
})

/*
GET by ID
ex: api.get('proposal', '594b49998dabd50e2c71762d')
*/
const get = (model, id, query) => ({
  url: `${API}/${version}/${model}/${id}`,
  options: { method: 'GET' },
  //  Assign response to prop.
  transform: body => ({ [`${model}`]: body }),
  body: { ...query },
  //  Update the models with next state
  update: { [`${model}`]: (prev, next) => next }
})

/*
CREATE: POST
Pass the object in as the body arg
ex: api.post('report', {})
*/
const post = (model, body) => mutateAsync({
  url: `${API}/${version}/${model}`,
  options: { method: 'POST' },
  //  Assign response to prop.
  transform: body => ({ [`${model}`]: body }),
  // body: { ...query },
  body,
  //  Update the models with next state
  update: { [`${model}`]: (prev, next) => next }
})

/*
UPDATE: PUT
ex: api.put('report', '594b49998dabd50e2c7176bf',
{ date: "2000-06-21T07:15:10.746Z" })
*/
const put = (model, id, body) => mutateAsync({
  url: `${API}/${version}/${model}/${id}`,
  options: { method: 'PUT' },
  //  Assign response to prop.
  transform: body => ({ [`${model}`]: body }),
  body,
  //  Update the models with next state
  update: { [`${model}`]: (prev, next) => next }
})

/*
DELETE
ex: api.remove('report', '594b49998dabd50e2c7176bf')
*/
const remove = (model, id) => mutateAsync({
  url: `${API}/${version}/${model}/${id}`,
  options: { method: 'DELETE' },
  //  Assign response to prop.
  transform: body => ({ [`${model}`]: body }),
  //  Update the models with next state
  update: { [`${model}`]: (prev, next) => next }
})

export default {
  //  Read (can use with connectRequest())
  getAll,
  get,
  //  Create
  post,
  //  Update
  put,
  //  Delete
  remove
}
