import { API, version } from './environment'

//  Define models so we can give methods as props later.
let api = {}
const models = [
  'contact', 'comment',
  'proposal', 'project', 'amendment', 'manifest', 'item', 'block',
  'review', 'decision', 'report'
]

models.map((model) => {
  api[model] = {}
  api[model].getAll = () => ({
    url: `${API}/${version}/${model}`,
    //  Server responds with an array. Assign to prop.
    transform: body => ({ [`${model}s`]: body }),
    //  Update store with next state
    update: { [`${model}s`]: (prev, next) => next }
  })
})
console.log(api)
console.log('---')
console.log(api.proposal.getAll())
export default api
