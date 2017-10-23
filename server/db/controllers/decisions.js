import REST from './restify'
import { Decision, Manifest, Proposal } from '../models'

export default class Decisions extends REST {
  constructor () {
    super(Decision)
    this.middleware = {
      ...this.config,
      postCreate: postCreateOrUpdate,
      postUpdate: postCreateOrUpdate
    }
  }
}

//  Patch missing ref arrays
async function postCreateOrUpdate (req, res, next) {
  let { result } = req.erm
  let changes = await updateProposal(result)
  console.log('CHANGES', changes)
  //  TODO: Find a way to test if populate.proposal, and if so, assign a new result.proposal
  next()
}

const mapBudgetToStatus = {
  original: (approved) => approved ? 'Funded' : 'Denied',
  partial: (approved) => approved ? 'Funded' : 'Denied',
  supplemental: (approved) => approved ? 'Funded' : 'Denied'
}
async function updateProposal (decision) {
  const { proposal, manifest, approved } = decision
  const { total, type } = await Manifest
    .findById(manifest)
    .select('type total')
  //  Generate status enum
  let received = approved ? total : 0
  let status = mapBudgetToStatus[type](approved)
  let update = type !== 'supplemental' ? { received, status } : { received }
  return Proposal
    .findByIdAndUpdate(proposal, update, { new: true })
}
