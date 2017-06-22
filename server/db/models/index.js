//  Export all core service models for creating a standard RESTful api
import contact from './contact'
import proposal from './proposal'
import project from './project'
import amendment from './amendment'
import manifest from './manifest'
import item from './item'
import block from './block'
import review from './review'
import decision from './decision'
import report from './report'
import comment from './comment'
export const restModels = [
  contact, comment,
  proposal, project, amendment, manifest, item, block,
  review, decision, report
]

//  Loads models into the app - used in init
export default function loadModels () {
  //  Auth and User data
  require('./user')
  require('./contact')
  //  Community content (mostly endorsements)
  require('./comment')
  //  Proposals
  require('./proposal')
  require('./project') //  a proposal body
  require('./amendment')
  require('./manifest')
  require('./item')
  require('./block')  //  Concise proposals for cont funding
  //  Proposal Meta
  require('./review')
  require('./decision')
  require('./report')
}
