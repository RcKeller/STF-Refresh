import REST from './rest'
import { Manifest, Item } from '../models'

export default class Manifests extends REST {
  constructor () {
    super(Manifest, '_id')
  }
  /* *****
    POST: Add a model
    Modified to insertMany(<items>)
  ***** */
  post (data, query) {
    console.log(data)
    let model = this.model.create(data)
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
    let model = this.model
    return model
      .findOneAndUpdate({ [this.key]: id }, data, { upsert: true, setDefaultsOnInsert: true })
      .then(modelInstance => modelInstance)
  }
}
