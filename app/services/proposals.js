import { API, version } from './environment'

//  GET ALL Proposal(s)
const getAll = () => ({
  url: `${API}/${version}/proposal`,
  //  Server responds with an array. Assign to prop.
  transform: body => ({ proposals: body }),
  //  Update store with next state
  update: { proposals: (prev, next) => next }
})
export default { getAll }
