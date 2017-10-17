import REST from './restify'
import { Manifest, Item, Proposal } from '../models'
import mongoose from 'mongoose'

import { Slack } from '../../integrations'

export default class Manifests extends REST {
  constructor () {
    super(Manifest)
    this.middleware = {
      ...this.config,
      preCreate: preCreate
      // preMiddleware: preMiddleware,
      // preCreate: function (req, res, next) {
      //   console.log(Object.keys(req.erm))
      //   next()
      // }
      // postProcess: postProcess

    }
  }
}

/*
MIDDLEWARE
*/
async function preCreate (req, res, next) {
  let { body } = req
  console.log(Object.keys(req.erm))
  body.type = await 'test'
  next()
}

// async function preMiddleware (req, res, next) {
//   let { body } = req
//   // console.log(Object.keys(req.erm))
//   body.total = getTotal(body.items)
//   body.items = await saveItems(body.items, body._id)
//   // let total = getTotal(body.items)
//   // let items = await saveItems(body.items, body._id)
//   // body.total = total
//   // body.items = items
//   console.log(body)
//   //  TODO: Update proposal
//   // if (body.type === 'original' && body.proposal) await updateProposalAsked(body.proposal, body.total)
//   //  Announcements
//   next()
// }
function preMiddleware (req, res, next) {
  let { body } = req
  // console.log(Object.keys(req.erm))
  body.total = getTotal(body.items)
  body.items = saveItems(body.items, body._id).then(items => items)
  // let total = getTotal(body.items)
  // let items = await saveItems(body.items, body._id)
  // body.total = total
  // body.items = items
  console.log(body)
  //  TODO: Update proposal
  // if (body.type === 'original' && body.proposal) await updateProposalAsked(body.proposal, body.total)
  //  Announcements
  next()
}
function postProcess (req, res, next) {
  const { method, path } = req
  const { statusCode, result } = req.erm
  console.info(`${method} ${path} request completed with status code ${statusCode}!`)
  announceNewBudgets(result)
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
