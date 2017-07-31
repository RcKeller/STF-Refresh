import REST from './rest'
import { Manifest, Item } from '../models'
import mongoose from 'mongoose'
import _ from 'lodash'

export default class Manifests extends REST {
  constructor () {
    super(Manifest, '_id')
  }
  /* *****
    POST: Add a model
    Modified to insertMany(<items>)
  ***** */
  post (data, query) {
    let { items } = data
    let manifest = _.omit(data, ['_v', 'items'])
    console.log(typeof items, items)
    console.log(typeof manifest, manifest)

    let model = this.model.create(manifest)
    //  TODO: Any middleware needed?
    return model.then(modelInstance => modelInstance)
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
    let manifest = _.omit(data, ['_v', 'items'])
    console.log(typeof manifest, manifest)
    console.log(typeof items, items)
    //  Keep track of item refs to update manifest.
    let itemRefs = []
    for (let item of items) {
      /*
      We're using findOneAndUpdate with upsertion (creation of documents if null is returned)
      HOWEVER, this does not automatically create a new objectID. So we do that part.
      We'll also keep track of refs so we can update the parent.
      Related:
      https://stackoverflow.com/questions/17244363/mongoose-findoneandupdate-upsert-id-null
      https://stackoverflow.com/questions/39761771/mongoose-findbyidandupdate-doesnt-generate-id-on-insert
      https://medium.skyrocketdev.com/es6-to-the-rescue-c832c286d28f
      */
      item.manifest = id
      let _id = item.id ? item.id : new mongoose.Types.ObjectId()
      Item.findOneAndUpdate({ _id }, item, { upsert: true, setDefaultsOnInsert: true, new: true })
      .exec((err, doc) => {
        console.log('RESULT', err, doc)
        if (!err) {
          itemRefs.push(doc._id)
        }
      })
      // Item.findOneAndUpdate({ _id }, item, { upsert: true, setDefaultsOnInsert: true })
      //   .then((itemInstance => {
      //     console.log('itemInstance', itemInstance)
      //   }))
    }
      // Item.update(criteria, item, { upsert: true, setDefaultsOnInsert: true })
      //   .then((itemModel) => console.log('updated', itemModel))
    // }

    //     .then(modelInstance => modelInstance)
    let model = this.model.findOne({ [this.key]: id })
    return model
     .then((modelInstance) => {
       for (var attribute in data) {
         if (data.hasOwnProperty(attribute) && attribute !== this.key && attribute !== '_id') {
           modelInstance[attribute] = data[attribute]
         }
       }
       // Update the manifest with the new child refs.
       modelInstance['items'] = itemRefs
       return modelInstance.save()
     })
     .then(modelInstance => modelInstance)
  }
  //   let model = this.model
  //   return model
  //     .findOneAndUpdate({ [this.key]: id }, manifest, { upsert: true, setDefaultsOnInsert: true })
  //     .then(modelInstance => modelInstance)
  // }
}
