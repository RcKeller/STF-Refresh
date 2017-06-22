import { API, version } from './environment'
/*
FOREWARD:
This file can be a little confusing, but here's what we're doing:
A) Creating a list of models that have restful endpoints
B) Initializing an API, which will hold methods for accessing each of those.
*/
//  TODO: create a querystring adapter that is API specific, packages don't work.

/*
GET all models
ex: api.getAll('proposal', { populate: 'contacts,decision' })
Can use complex queries as an obj
*/
const getAll = (model, query) => ({
  url: `${API}/${version}/${model}`,
  'options.method': 'GET',
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
  'options.method': 'GET',
  //  Assign response to prop.
  transform: body => ({ [`${model}`]: body }),
  body: { ...query },
  //  Update the models with next state
  update: { [`${model}`]: (prev, next) => next }
})

const post = (model, body) => ({
  url: `${API}/${version}/${model}`,
  'options.method': 'POST',
  //  Assign response to prop.
  transform: body => ({ [`${model}`]: body }),
  // body: { ...query },
  body,
  //  Update the models with next state
  update: { [`${model}`]: (prev, next) => next }
})

export default {
  //  Read (can use with connectRequest())
  getAll,
  get,
  //  CUD: Need to use mutateAsync(), can promise chain (...then(res => ...))
  //  Create
  post
  //  Update
  //  Delete
}
