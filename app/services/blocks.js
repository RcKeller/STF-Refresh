import { API, version } from './environment'

//  GET all Proposals
const getAll = () => ({
  url: `${API}/${version}/blocks`,
  // Server responds with an array. Assign to prop.
  transform: body => ({
    blocks: body
  }),
  update: {
    blocks: (prev, next) => next
  }
})
export default { getAll }
