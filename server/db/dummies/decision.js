import mongoose from 'mongoose'
import faker from 'faker'
import Decision from '../models/decision'

/*
FAKE DATA GENERATOR: Decision
*/
export default function dummyDecisions (min) {
  //  Check the db for existing data satisfying min required
  Decision.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Decision schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Decision({
          proposal: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
          amendment: new mongoose.Types.ObjectId(),  // THIS IS RANDOM,
          date: faker.date.recent(),
          author: new mongoose.Types.ObjectId(),  // THIS IS RANDOM,
          body: faker.lorem.paragraph(),
          approved: faker.random.boolean(),
          grant: faker.random.number(),
          report: new mongoose.Types.ObjectId()
        })
      }
      //  Create will push our fakes into the DB.
      Decision.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Decision (${fakes.length})`) }
      })
    }
  })
}
