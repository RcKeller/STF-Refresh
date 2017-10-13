import REST from './restify'
import { Manifest, Item, Proposal } from '../models'
import mongoose from 'mongoose'
import _ from 'lodash'

import { Slack } from '../../integrations'

export default class Manifests extends REST {
  constructor () {
    super(Manifest)
    this.middleware = {
      ...this.config,
      preMiddleware: this.preMiddleware,
      postProcess: this.postProcess
    }
  }
  /*
  MIDDLEWARE
  */
  async preMiddleware (req, res, next) {
    let { body } = req
    body.total = getTotal(body.items)
    body.items = await saveItems(body.items, body._id)
    //  TODO: Update proposal
    if (body.type === 'original' && body.proposal) updateProposalAsked(body.proposal, body.total)
    //  Announcements
    next()
  }
  postProcess (req, res, next) {
    const { method, path } = req
    const { statusCode, result } = req.erm
    console.info(`${method} ${path} request completed with status code ${statusCode}!`)
    announceNewBudgets(result)
  }
}

/*
METHODS
These are outside class scope because async functions are really just wrapped promises
and as such, can't be class methods, and wrapping them is a hack.
*/
/*
getTotal: Calculate grand totals
*/
function getTotal (items = []) {
  console.log('GETTOTAL')
  let total = 0
  for (let item of items) {
    if (item.quantity > 0) {
      item.tax
        ? total += (item.price * item.quantity * (1 + item.tax / 100))
        : total += (item.price * item.quantity)
    }
  }
  console.log('TOTAL', total)
  return total
}
/*
Saveitems: Upserts items, then returns an array of their IDs
  NOTE: Saving items will overwrite whatever exists.
  This is for security, and left because we do not have a use case where sub items need to be merged.
  Implication - patching a manifest writes new items.
  //  BUG: https://github.com/florianholzapfel/express-restify-mongoose/issues/276
*/
async function saveItems (items = [], manifest) {
  console.log('SAVEITEMS', items)
  const createOrUpdateOptions = { upsert: true, setDefaultsOnInsert: true, new: true }
  let promises = items.map((item) => {
    if (!item.manifest && manifest) item.manifest = manifest
    if (!item._id) item._id = mongoose.Types.ObjectId()
    return Item
      .findByIdAndUpdate(item._id, item, createOrUpdateOptions)
      .then(doc => doc._id)
  })
  let refs = await Promise.all(promises)
  console.log('REFS', refs)
  return refs
}
/*
updateProposalAsked: Updates the ask for a proposal
*/
async function updateProposalAsked (proposal, asked) {
  console.log('TODO: Implement updateProposalAsked', proposal, asked)
  Proposal.findByIdAndUpdate(proposal, { asked })
  return 0
}

/*
announceNewBudgets: Announces non-draft budget submissions (partial budgets, supplemental requests)
We get proposal data first so that we can use it when logging to slack.
*/
async function announceNewBudgets (manifest) {
  const { proposal, type } = manifest
  let parent = await Proposal.findById(proposal)
  console.log('Announcing', parent)
  if (parent) {
    switch (type) {
      case 'supplemental':
        console.log('supplemental')
        Slack.announceSupplemental(manifest, parent)
        break
      case 'partial':
        console.log('partial')
        Slack.announcePartial(manifest, parent)
        break
    }
  }
}
