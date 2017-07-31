import REST from './rest'
import { Manifest, Item } from '../models'
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
    for (let item of items) {
      item.manifest = id
      // let { _id } = item
      //  Don't upsert this:  https://stackoverflow.com/questions/39761771/mongoose-findbyidandupdate-doesnt-generate-id-on-insert
      Item.findOne({ id: item._id }, (err, doc) => {
        console.log('RESULT', err, doc)
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
