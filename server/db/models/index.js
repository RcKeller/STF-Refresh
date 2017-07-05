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
import Contact, { dummyContacts } from './contact'
import Proposal, { dummyProposals } from './proposal'
import Project, { dummyProjects } from './project'
import Amendment, { dummyAmendments } from './amendment'
import Manifest, { dummyManifests } from './manifest'
import Item, { dummyItems } from './item'
import Block, { dummyBlocks } from './block'
import Review, { dummyReviews } from './review'
import Decision, { dummyDecisions } from './decision'
import Report, { dummyReports } from './report'
import Comment, { dummyComments } from './comment'
//  Note that users are not here, that's bespoke.
export {
  Contact, Comment,
  Proposal, Project, Amendment, Manifest, Item, Block,
  Review, Decision, Report
}
export const restDummies = [
  dummyContacts, dummyComments,
  dummyProposals, dummyProjects, dummyAmendments, dummyManifests, dummyItems, dummyBlocks,
  dummyReviews, dummyDecisions, dummyReports
]
