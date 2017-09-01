import REST from './rest'
import { Report, Item, Manifest } from '../models'
import mongoose from 'mongoose'
import _ from 'lodash'

import { Slack } from '../../integrations'

export default class Reports extends REST {
  constructor () {
    super(Report, '_id')
  }
  /* *****
    POST: Add a model
    Modified to insertMany(<items>)
  ***** */
  post (data, query) {
    //  Omit subdocs, create the parent, then patch it in order to create items
    let { items } = data
    let report = _.omit(data, ['_v', 'items'])
    return this.model.create(report)
    .then(modelInstance => this.patch(modelInstance._id, { items }, query))
  }

  /* *****
    PATCH: Update a model
    (also known as PUT in other REST api specs)
    Modified to insertMany(<items>)
  ***** */
  patch (id, data, query) {
    //  https://codexample.org/questions/306428/mongodb-mongoose-subdocuments-created-twice.c
    //  https://github.com/linnovate/mean/issues/511
    //  BUG: Fails when trying to patch other data. Solution - call super() if there aren't any items?
    if (!data.items) {
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
      //  Keep track of item refs to update report.
      let { items } = data
      let itemRefs = []
      for (let item of items) {
        item = _.omit(item, ['__v'])
        item.report = id
        let _id = item._id ? item._id : new mongoose.Types.ObjectId()
        Item.findOneAndUpdate({ _id }, item, { upsert: true, setDefaultsOnInsert: true, new: true })
        .exec((err, doc) => {
          if (!err && doc) itemRefs.push(doc._id)
        })
      }
      let model = this.model.findOne({ [this.key]: id })
      return model
       .then((modelInstance) => {
         for (var attribute in data) {
           if (data.hasOwnProperty(attribute) && attribute !== this.key && attribute !== '_id') {
             modelInstance[attribute] = data[attribute]
           }
         }
         // Update the report with the new child refs. Replace the entire thing to handle deleted records.
         modelInstance.items = itemRefs
         // Check for overexpenditure here
         if (!Number.isNaN(data.total) && data.manifest) {
           Manifest
            .findById(data.manifest)
            .populate('proposal')
            .exec()
            .then(manifest => {
              if (data.total > manifest.total) Slack.announceOverexpenditure(data, manifest)
            })
         }
         return modelInstance.save()
       })
       .then(modelInstance => modelInstance)
    }
  }
}
