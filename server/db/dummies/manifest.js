import mongoose from 'mongoose'
import faker from 'faker'
import Manifest from '../models/manifest'

/*
FAKE DATA GENERATOR: Manifest
*/
export default function dummyManifests (min) {
  //  Check the db for existing data satisfying min required
  Manifest.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Manifest schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Manifest({
          proposal: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
          original: faker.random.boolean(),
          items: [
            new mongoose.Types.ObjectId(),  // THIS IS RANDOM
            new mongoose.Types.ObjectId()
          ],
          subtotal: faker.random.number(),
          tax: faker.random.number(),
          total: faker.random.number()
        })
      }
      //  Create will push our fakes into the DB.
      Manifest.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Manifest (${fakes.length})`) }
      })
    }
  })
}
