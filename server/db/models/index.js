/*
MODEL INITIALIZER
Uses require() to pass the imports around as a func.
*/
export default function loadModels () {
  //  Auth and User data
  require('./user')
  require('./committee')
  require('./contact')
  //  Community content (mostly endorsements)
  require('./comment')
  //  Proposals
  require('./proposal')
  require('./project') //  a proposal body
  require('./supplemental')
  require('./manifest')
  require('./item')
  require('./block')  //  Concise proposals for cont funding
  //  Proposal Meta
  require('./review')
  require('./decision')
  require('./report')
  require('./article')
}

/*
RESTful MODELS (and their dummy data generators)
For express-restify-mongoose
*/

import User, { dummyUsers } from './user'
import Committee, { dummyCommittees } from './committee'
import Contact, { dummyContacts } from './contact'
import Comment, { dummyComments } from './comment'
import Proposal, { dummyProposals } from './proposal'
import Project, { dummyProjects } from './project'
import Supplemental, { dummySupplementals } from './supplemental'
import Manifest, { dummyManifests } from './manifest'
import Item, { dummyItems } from './item'
import Block, { dummyBlocks } from './block'
import Review, { dummyReviews } from './review'
import Decision, { dummyDecisions } from './decision'
import Report, { dummyReports } from './report'
import Article, { dummyArticles } from './article'
//  Note that users are not here, that's bespoke.
export {
  User, Committee, Contact, Comment,
  Proposal, Project, Supplemental, Manifest, Item, Block,
  Review, Decision, Report, Article
}
export const restDummies = [
  dummyUsers, dummyCommittees, dummyContacts, dummyComments,
  dummyProposals, dummyProjects, dummySupplementals, dummyManifests, dummyItems, dummyBlocks,
  dummyReviews, dummyDecisions, dummyReports, dummyArticles
]
