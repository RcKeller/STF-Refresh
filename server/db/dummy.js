import mongoose from 'mongoose'
import config from 'config'

import { restDummies } from './models'

export default function () {
  const min = config.has('lorem-ipsum') ? config.get('lorem-ipsum') : 5 // default
  console.log(`SEED: Lorem Ipsum Mode enabled. Seeding up to ${min} documents each...`)
  //  Activate dummy data generators, with specified minimums document counts.

  //  Generate an object containing ObjectIds for dummy objects.
  const ids = {
    contact: [],
    comment: [],
    proposal: [],
    project: [],
    amendment: [],
    manifest: [],
    item: [],
    block: [],
    review: [],
    decision: [],
    report: [],
    user: []
    //  User?
  }
  Object.keys(ids).forEach((key) => {
    for (let i = 0; i < min; i++) {
      ids[key].push(new mongoose.Types.ObjectId())
    }
  })
  //  Create dummies for all RESTful models
  restDummies.map((model) => model(min, ids))
}
