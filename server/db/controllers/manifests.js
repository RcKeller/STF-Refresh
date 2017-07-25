import REST from './rest'
import { Manifest, Item } from '../models'
import _  from 'lodash'

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

    let model = this.model
    return model
      .findOneAndUpdate({ [this.key]: id }, manifest, { upsert: true, setDefaultsOnInsert: true })
      .then(modelInstance => modelInstance)
  }
}
