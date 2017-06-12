import mongoose from 'mongoose'
import faker from 'faker'
import Review from '../models/review'

/*
FAKE DATA GENERATOR: Review
*/
export default function dummyReviews (min) {
  //  Check the db for existing data satisfying min required
  Review.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Review schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Review({
          proposal: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
          date: faker.date.recent(),
          user: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
          body: faker.lorem.paragraph(),
          decision: faker.random.boolean(),
          score: faker.random.number(),
          ratings: [] // No idea, haven't figured out this data struct yet.
        })
      }
      //  Create will push our fakes into the DB.
      Review.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Review (${fakes.length})`) }
      })
    }
  })
}
