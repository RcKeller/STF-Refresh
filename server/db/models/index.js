/*
MODEL INITIALIZER
Uses require() to pass the imports around as a func.
*/
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

/*
RESTful MODELS (and their dummy data generators)
For express-restify-mongoose
*/
import contact, { dummyContacts } from './contact'
import proposal, { dummyProposals } from './proposal'
import project, { dummyProjects } from './project'
import amendment, { dummyAmendments } from './amendment'
import manifest, { dummyManifests } from './manifest'
import item, { dummyItems } from './item'
import block, { dummyBlocks } from './block'
import review, { dummyReviews } from './review'
import decision, { dummyDecisions } from './decision'
import report, { dummyReports } from './report'
import comment, { dummyComments } from './comment'
//  Note that users are not here, that's bespoke.
export const restModels = [
  contact, comment,
  proposal, project, amendment, manifest, item, block,
  review, decision, report
]
export const restDummies = [
  dummyContacts, dummyComments,
  dummyProposals, dummyProjects, dummyAmendments, dummyManifests, dummyItems, dummyBlocks,
  dummyReviews, dummyDecisions, dummyReports
]
