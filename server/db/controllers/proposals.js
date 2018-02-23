import REST from './restify'
import { Proposal, Config } from '../models'
import { Slack } from '../../integrations'

export default class Proposals extends REST {
  constructor () {
    super(Proposal)
    this.middleware = {
      ...this.config,
      preUpdate: preUpdate
    }
  }
  // TODO: Assign year/number when published, and announce new proposals.
}

/*
MIDDLEWARE
*/
async function preUpdate (req, res, next) {
  let { body } = req
  body = await assignNumberIfPublishing(body)
  //  BUGFIX: For PUT/PATCH, mongoose fails to save arrays of refs.
  //  We carry ref arrays in temp vars and Object.assign after a manual patch.
  req.erm.bugfixrefs = { items: body.items }
  next()
}

async function assignNumberIfPublishing (proposal) {
  let { _id, number, published } = proposal

  //  If published and !numbered, check if it was previously unpublished w/o meta
  if (published && !number) {
    let { prevPublished, prevNumber } = await Proposal
      .findById(_id)
      .select('published number')
      .then((doc) => ({
        prevPublished: doc ? doc.published : false,
        prevNumber: doc ? doc.number : 0
      }))
    if (!prevPublished && !prevNumber) {
      // It's being published. Find year from config, the next number based on others this year
      let { year, quarter } = await Config
        .findOne({})
        .select('year quarter')
      let topNumber = await Proposal
        .count({ year }) || 0
      //  Hydrate this new publication and announce it
      proposal.year = year
      proposal.number = ++topNumber
      proposal.quarter = quarter
      proposal.status = 'In Review'
      //  Return a mutated doc for saving
      Slack.announceProposal(proposal)
      return proposal
    }
  }
  return proposal
}
