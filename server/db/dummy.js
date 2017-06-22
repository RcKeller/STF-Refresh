import config from 'config'

// import { dummyUsers } from './models/user'
import { dummyContacts } from './models/contact'
import { dummyComments } from './models/comment'
import { dummyProposals } from './models/proposal'
import { dummyProjects } from './models/project'
import { dummyAmendments } from './models/amendment'
import { dummyManifests } from './models/manifest'
import { dummyItems } from './models/item'
import { dummyBlocks } from './models/block'
import { dummyReviews } from './models/review'
import { dummyDecisions } from './models/decision'
import { dummyReports } from './models/report'
 // For faking Object ID's. THESE WILL BE RANDOM AND NOT POINT TO REAL DATA.

export default function () {
  const min = config.has('lorem-ipsum') ? config.get('lorem-ipsum') : 5 // default
  console.log(`SEED: Lorem Ipsum Mode enabled. Seeding up to ${min} documents each...`)

  //  Auth and User data
  // dummyUsers(min)
  dummyContacts(min)
  //  Community content (mostly endorsements)
  dummyComments(min)
  //  Proposals
  dummyProposals(min)
  dummyProjects(min)
  dummyAmendments(min)
  dummyManifests(min)
  dummyItems(min)
  dummyBlocks(min)
  //  Proposal Meta
  dummyReviews(min)
  dummyDecisions(min)
  dummyReports(min)
}
