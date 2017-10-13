// import REST from './rest'
import { Manifest, Item, Proposal } from '../models'
import restify from 'express-restify-mongoose'
import mongoose from 'mongoose'
import _ from 'lodash'

import { Router } from 'express'
import { Slack } from '../../integrations'

export default class Manifests {
  constructor () {
    this.config = {
      prefix: '',
      version: '/v1',
      //  Disabling these allows middleware to be called
      findOneAndUpdate: false,
      findOneAndRemove: false,
      access: (req) => 'private',
      outputFn: (req, res) => {
        const result = req.erm.result
        const statusCode = req.erm.statusCode
        res.status(statusCode).json(result)
      },
      postProcess: (req, res, next) => {
        const statusCode = req.erm.statusCode
        console.info(`${req.method} ${req.path} request completed with status code ${statusCode}`)
      },
      onError: (err, req, res, next) => {
        const statusCode = req.erm.statusCode
        console.log(err)
        res.status(statusCode).json({ message: err.message })
      }
    }
  }
  /*
  API
  */
  API () {
    const router = new Router()
    const options = {
      preMiddleware: this.preMiddleware,
      ...this.config
    }
    restify.serve(router, Manifest, options)
    console.log(`REST: Instantiated controller: Manifests`)
    return router
  }
  /*
  MIDDLEWARE
  */
  async preMiddleware (req, res, next) {
    let { body } = req
    body.total = await this.getTotal(body.items)
    body.items = await this.saveItems(body.items, body._id)
    //  TODO: Update proposal
    // if (body.type === 'original' && body.proposal) this.updateProposalAsked(body.proposal, body.total)
    next()
  }
  /*
  METHODS
  */
  /*
  Upserts items, then returns an array of their IDs
    NOTE: Saving items will overwrite whatever exists.
    This is for security, and left because we do not have a use case where sub items need to be merged.
    Implication - patching a manifest writes new items.
    //  BUG: https://github.com/florianholzapfel/express-restify-mongoose/issues/276
  */
  async saveItems (items = [], manifest) {
    const createOrUpdateOptions = { upsert: true, setDefaultsOnInsert: true, new: true }
    let promises = items.map((item) => {
      if (!item.manifest && manifest) item.manifest = manifest
      if (!item._id) item._id = mongoose.Types.ObjectId()
      return Item
        .findByIdAndUpdate(item._id, item, createOrUpdateOptions)
        .then(doc => doc._id)
    })
    let refs = await Promise.all(promises)
    return refs
  }
  /*
  Calculate grand totals
  */
  async getTotal (items = []) {
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
  updateProposalAsked (proposal, total) {
    return 0
  }
}
//   /* *****
//     POST: Add a model
//     Modified to insertMany(<items>)
//   ***** */

// export default class Manifests extends REST {
//   constructor () {
//     super(Manifest, '_id')
//   }
//   /* *****
//     POST: Add a model
//     Modified to insertMany(<items>)
//   ***** */
//   post (data, query) {
//     //  Omit subdocs, create the parent, then patch it in order to create items
//     let { items } = data
//     let manifest = _.omit(data, ['_v', 'items'])
//     //  NOTE: Should I assign a model var and return model.patch?
//     return this.model
//       .create(manifest)
//       .then(model => {
//         switch (model.type) {
//           case 'supplemental':
//             Proposal
//               .findById(model.proposal)
//               .then(proposal => Slack.announceSupplemental(model, proposal))
//               .catch(err => console.warn(err))
//             break
//           case 'partial':
//             Proposal
//               .findById(model.proposal)
//               .then(proposal => Slack.announcePartial(model, proposal))
//               .catch(err => console.warn(err))
//             break
//         }
//         return this.patch(model._id, { items }, query)
//       })
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
//     if (data.proposal && data.total) {
//       this.updateProposalAsked(data.proposal, data.total)
//     }
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
//       //  Keep track of item refs to update manifest.
//       let { items } = data
//       let itemRefs = []
//       for (let item of items) {
//         item = _.omit(item, ['__v'])
//         if (!item.manifest) item.manifest = id
//         if (!item._id) item._id = mongoose.Types.ObjectId()
//         const mongoOptions = { upsert: true, setDefaultsOnInsert: true, new: true }
//         Item
//           .findOneAndUpdate({ _id: item._id }, item, mongoOptions)
//           .exec((err, doc) => {
//             //  Save item ref so we can update parent manifest.
//             if (!err && doc) {
//               itemRefs.push(doc._id)
//             }
//           })
//       }
//       let model = this.model.findOne({ [this.key]: id })
//       return model
//        .then((modelInstance) => {
//          for (var attribute in data) {
//            if (data.hasOwnProperty(attribute) && attribute !== this.key && attribute !== '_id') {
//              modelInstance[attribute] = data[attribute]
//            }
//          }
//          // Update the manifest with the new child refs. Replace the entire thing to handle deleted records.
//          modelInstance.items = itemRefs
//          return modelInstance.save()
//        })
//        .then(modelInstance => modelInstance)
//     }
//   }
//   updateProposalAsked (id, asked) {
//     console.log('UPDATING PROPOSAL TOTAL:', id, asked)
//     Proposal.findByIdAndUpdate(id, { asked })
//   }
// }
