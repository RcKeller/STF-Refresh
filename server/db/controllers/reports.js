import REST from './restify'
import { Report, Manifest, Item, Proposal } from '../models'
import mongoose from 'mongoose'
import _ from 'lodash'

import { Slack } from '../../integrations'

export default class Manifests extends REST {
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
    // if (!Number.isNaN(result.total) && result.manifest) checkForOverexpenditures(result)
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

// export default class Reports extends REST {
//   constructor () {
//     super(Report, '_id')
//   }
//   /* *****
//     POST: Add a model
//     Modified to insertMany(<items>)
//   ***** */
//   post (data, query) {
//     //  Omit subdocs, create the parent, then patch it in order to create items
//     let { items } = data
//     let report = _.omit(data, ['_v', 'items'])
//     return this.model.create(report)
//     .then(modelInstance => this.patch(modelInstance._id, { items }, query))
//   }
//
//   /* *****
//     PATCH: Update a model
//     (also known as PUT in other REST api specs)
//     Modified to insertMany(<items>)
//   ***** */
//   patch (id, data, query) {
//     //  https://codexample.org/questions/306428/mongodb-mongoose-subdocuments-created-twice.c
//     //  https://github.com/linnovate/mean/issues/511
//     //  BUG: Fails when trying to patch other data. Solution - call super() if there aren't any items?
//     if (!data.items) {
//       return super.patch(id, data, query)
//     } else {
//       /*
//       We're using findOneAndUpdate with upsertion (creation of documents if null is returned)
//       HOWEVER, this does not automatically create a new objectID. So we do that part.
//       We'll also keep track of refs so we can update the parent.
//       Related:
//       https://stackoverflow.com/questions/17244363/mongoose-findoneandupdate-upsert-id-null
//       https://stackoverflow.com/questions/39761771/mongoose-findbyidandupdate-doesnt-generate-id-on-insert
//       https://medium.skyrocketdev.com/es6-to-the-rescue-c832c286d28f
//       */
//       //  Keep track of item refs to update report.
//       let { items } = data
//       let itemRefs = []
//       for (let item of items) {
//         item = _.omit(item, ['__v'])
//         item.report = id
//         let _id = item._id ? item._id : new mongoose.Types.ObjectId()
//         Item.findOneAndUpdate({ _id }, item, { upsert: true, setDefaultsOnInsert: true, new: true })
//         .exec((err, doc) => {
//           if (!err && doc) itemRefs.push(doc._id)
//         })
//       }
//       let model = this.model.findOne({ [this.key]: id })
//       return model
//        .then((modelInstance) => {
//          for (var attribute in data) {
//            if (data.hasOwnProperty(attribute) && attribute !== this.key && attribute !== '_id') {
//              modelInstance[attribute] = data[attribute]
//            }
//          }
//          // Update the report with the new child refs. Replace the entire thing to handle deleted records.
//          modelInstance.items = itemRefs
//          // Check for overexpenditure here
//          if (!Number.isNaN(data.total) && data.manifest) {
//            Manifest
//             .findById(data.manifest)
//             .populate('proposal')
//             .exec()
//             .then(manifest => {
//               if (data.total > manifest.total) Slack.announceOverexpenditure(data, manifest)
//             })
//          }
//          return modelInstance.save()
//        })
//        .then(modelInstance => modelInstance)
//     }
//   }
// }
