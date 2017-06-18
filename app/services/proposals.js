import { API, version } from './environment'

//  GET all Proposals
const getAll = () => ({
  url: `${API}/${version}/proposals`,
  // Server responds with an array. Assign to prop.
  transform: body => ({
    proposals: body
  }),
  update: {
    proposals: (prev, next) => next
  }
})
export default { getAll }
