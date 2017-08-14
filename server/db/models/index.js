/*
MODEL INITIALIZER
Uses require() to pass the imports around as a func.
*/
export default function loadModels () {
  //  Auth and User data
  require('./config')
  require('./user')
  require('./stf')
  require('./contact')
  //  Community content (mostly endorsements)
  require('./comment')
  //  Proposals
  require('./proposal')
  require('./project') //  a proposal body
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
import Config, { dummyConfigs } from './config'
import User, { dummyUsers } from './user'
import STF, { dummySTF } from './stf'
import Contact, { dummyContacts } from './contact'
import Comment, { dummyComments } from './comment'
import Proposal, { dummyProposals } from './proposal'
import Project, { dummyProjects } from './project'
import Manifest, { dummyManifests } from './manifest'
import Item, { dummyItems } from './item'
import Block, { dummyBlocks } from './block'
import Review, { dummyReviews } from './review'
import Decision, { dummyDecisions } from './decision'
import Report, { dummyReports } from './report'
import Article, { dummyArticles } from './article'
//  Note that users are not here, that's bespoke.
export {
  Config, User, STF, Contact, Comment,
  Proposal, Project, Manifest, Item, Block,
  Review, Decision, Report, Article
}
export const restDummies = [
  dummyConfigs, dummyUsers, dummySTF, dummyContacts, dummyComments,
  dummyProposals, dummyProjects, dummyManifests, dummyItems, dummyBlocks,
  dummyReviews, dummyDecisions, dummyReports, dummyArticles
]
