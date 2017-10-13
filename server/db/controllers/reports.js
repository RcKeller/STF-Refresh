import REST from './restify'
import { Report, Manifest, Item } from '../models'
import mongoose from 'mongoose'

import { Slack } from '../../integrations'

export default class Reports extends REST {
  constructor () {
    super(Report)
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
    next()
  }
  postProcess (req, res, next) {
    const { method, path } = req
    const { statusCode, result } = req.erm
    console.info(`${method} ${path} request completed with status code ${statusCode}!`)
    checkForOverexpenditures(result)
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
async function saveItems (items = [], report) {
  console.log('SAVEITEMS', items)
  const createOrUpdateOptions = { upsert: true, setDefaultsOnInsert: true, new: true }
  let promises = items.map((item) => {
    if (!item.manifest && report) item.report = report
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
checkForOverexpenditures will report any expenses exceeding award allocations.
//  BUG: Sometimes does not pop correctly, could be related to my postman setup
*/
async function checkForOverexpenditures (report) {
  if (!Number.isNaN(report.total) && report.manifest) {
    let manifest = await Manifest
      .findById(report.manifest)
      .populate('proposal')
      .exec()
      .then(m => m)
    if (report.total > manifest.total) Slack.announceOverexpenditure(report, manifest)
  }
}
