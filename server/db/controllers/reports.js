import REST from './restify'
import { Report, Item } from '../models'
import mongoose from 'mongoose'

// import { Slack } from '../../integrations'

export default class Reports extends REST {
  constructor () {
    super(Report)
    this.middleware = {
      ...this.config,
      preCreate: preCreateOrUpdate,
      preUpdate: preCreateOrUpdate,
      postCreate: postCreate,
      postUpdate: postUpdate
    }
  }
}
/*
BUG: Found the cause of the bug
Mongoose will not be able to patch embedded arrays
https://github.com/Automattic/mongoose/issues/1204
https://stackoverflow.com/questions/24618584/mongoose-save-not-updating-value-in-an-array-in-database-document
https://stackoverflow.com/questions/33557086/mongoose-not-saving-embedded-object-array
*/
/*
MIDDLEWARE
*/
async function preCreateOrUpdate (req, res, next) {
  let { body } = req
  if (body.items) {
    body.total = getTotal(body)
    body.items = await saveItems(body)
    //  BUGFIX: For PUT/PATCH, mongoose fails to save arrays of refs (they resolve as null).
    //  We carry ref arrays in temp vars and Object.assign after a manual patch.
    req.erm.bugfixrefs = { items: body.items }
  }
  next()
}

//  Update proposal asked, and/or announce new budgets
async function postCreate (req, res, next) {
  // let { result } = req.erm
  // const { proposal } = result
  // console.log('Report for Proposal', proposal)
  //  TODO: Announce new reports
  next()
}

//  Patch missing ref arrays
async function postUpdate (req, res, next) {
  let { result, bugfixrefs } = req.erm
  const report = result._id
  //  Patch missing refs from subdoc arrays - mongo bug
  if (bugfixrefs) {
    let patch = await Report
    .findByIdAndUpdate(report, bugfixrefs, { new: true })
    .populate('items')
    Object.assign(result, patch)
  }
  next()
}

/*
METHODS
These are outside class scope because async functions are really just wrapped promises
and as such, can't be class methods, and wrapping them is a hack.
*/
/*
getTotal: Calculate grand totals
*/
function getTotal (manifest) {
  const { items } = manifest
  let total = 0
  for (let item of items) {
    if (item.quantity > 0) {
      item.tax
        ? total += (item.price * item.quantity * (1 + item.tax / 100))
        : total += (item.price * item.quantity)
    }
  }
  return total
}
/*
Saveitems: Upserts items, then returns an array of their IDs
  NOTE: Saving items will overwrite whatever exists.
  This is for security, and left because we do not have a use case where sub items need to be merged.
  Implication - patching a manifest writes new items.
  //  BUG: https://github.com/florianholzapfel/express-restify-mongoose/issues/276
*/
async function saveItems (report) {
  const { _id, items } = report
  const createOrUpdateOptions = { upsert: true, setDefaultsOnInsert: true, new: true }
  let promises = items.map((item) => {
    if (!item.report && _id) item.report = _id
    if (!item._id) item._id = mongoose.Types.ObjectId()
    return Item
      .findByIdAndUpdate(item._id, item, createOrUpdateOptions)
      .then(doc => doc._id)
  })
  let refs = await Promise.all(promises)
  return refs
}

/*
hfghf
*/
