import REST from './rest'
import { Decision, Proposal, Manifest } from '../models'
// import mongoose from 'mongoose'
// import _ from 'lodash'

export default class Decisions extends REST {
  constructor () {
    super(Decision, '_id')
  }

  /*
  POST
  Update proposal received (funded) field if approved
  */
  post (data, query) {
    let model = this.model.create(data)
    //  Approved proposals get an update based on the manifest total cost.
    if (data.approved) {
      Manifest
        .findById(data.manifest)
        .select('total')
        .then(({total}) => {
          const update = { received: total }
          Proposal
            .findByIdAndUpdate(data.proposal, update, (err) => err && console.warn(err))
        })
    } else {
      const update = { received: 0 }
      Proposal
        .findByIdAndUpdate(data.proposal, update)
    }
    return model.then(modelInstance => modelInstance)
  }
}
