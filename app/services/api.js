import { API, version } from './environment'

/*
FOREWARD:
This file can be a little confusing, but here's what we're doing:
A) Creating a list of models that have restful endpoints
B) Initializing an API, which will hold methods for accessing each of those.
*/

const getAll = (model) => ({
  url: `${API}/${version}/${model}`,
  // Server responds with an array. Assign to prop.
  transform: body => ({
    [`${model}s`]: body
  }),
  update: {
    [`${model}s`]: (prev, next) => next
  }
})

export default { getAll }
