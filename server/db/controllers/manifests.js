import REST from './rest'
import { Manifest, Item, Proposal } from '../models'
import mongoose from 'mongoose'
import _ from 'lodash'

import { Slack } from '../../integrations'

export default class Manifests extends REST {
  constructor () {
    super(Manifest, '_id')
  }
  /* *****
    POST: Add a model
    Modified to insertMany(<items>)
  ***** */
  post (data, query) {
    //  Omit subdocs, create the parent, then patch it in order to create items
    let { items } = data
    let manifest = _.omit(data, ['_v', 'items'])
    //  NOTE: Should I assign a model var and return model.patch?
    return this.model
      .create(manifest)
      .then(model => {
        switch (model.type) {
          case 'supplemental':
            Proposal
              .findById(model.proposal)
              .then(proposal => Slack.announceSupplemental(model, proposal))
              .catch(err => console.warn(err))
            break
          case 'partial':
            Proposal
              .findById(model.proposal)
              .then(proposal => Slack.announcePartial(model, proposal))
              .catch(err => console.warn(err))
            break
        }
        return this.patch(model._id, { items }, query)
      })
  }

  /* *****
    PATCH: Update a model
    (also known as PUT in other REST api specs)
    Modified to insertMany(<items>)
  ***** */
  patch (id, data, query) {
    //  https://codexample.org/questions/306428/mongodb-mongoose-subdocuments-created-twice.c
    //  https://github.com/linnovate/mean/issues/511
    let { items } = data
    if (!items) {
      return super.patch(id, data, query)
    } else {
      /*
      We're using findOneAndUpdate with upsertion (creation of documents if null is returned)
      HOWEVER, this does not automatically create a new objectID. So we do that part.
      We'll also keep track of refs so we can update the parent.
      Related:
      https://stackoverflow.com/questions/17244363/mongoose-findoneandupdate-upsert-id-null
      https://stackoverflow.com/questions/39761771/mongoose-findbyidandupdate-doesnt-generate-id-on-insert
      https://medium.skyrocketdev.com/es6-to-the-rescue-c832c286d28f
      */
      //  Keep track of item refs to update manifest.
      let model = this.model.findOne({ [this.key]: id })
      model
       .then((modelInstance) => {
         for (var attribute in data) {
           if (data.hasOwnProperty(attribute) && attribute !== this.key && attribute !== '_id') {
             modelInstance[attribute] = data[attribute]
           }
         }

         let itemRefs = []
         for (let item of items) {
           item = _.omit(item, ['__v'])
           if (!item.manifest) item.manifest = id
           if (!item._id) item._id = mongoose.Types.ObjectId()
           const mongoOptions = { upsert: true, setDefaultsOnInsert: true, new: true }
           Item
             .findOneAndUpdate({ _id: item._id }, item, mongoOptions)
             .exec((err, doc) => {
               if (!err && doc) {
                 //  Save item ref so we can update parent manifest.
                 itemRefs.push(doc._id)
                 console.log('ADDED REF', doc.name, doc._id, itemRefs.length)
               }
               // Last item ref saved? Finish saving
               if (itemRefs.length === items.length) {
                 // Update the manifest with the new child refs. Replace the entire thing to handle deleted records.
                 modelInstance.items = itemRefs
                 return modelInstance.save()
               }
             })
         }
       })
       .then(modelInstance => modelInstance)
    }
  }
}
