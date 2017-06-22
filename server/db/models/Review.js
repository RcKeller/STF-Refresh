import mongoose from 'mongoose'
import faker from 'faker'

const ReviewSchema = new mongoose.Schema({
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  body: String,
  decision: Boolean,
  score: Number,
  // Ratings are simple key-value stores, key is criteria, value is score.
  ratings: []
})
const Review = mongoose.model('Review', ReviewSchema)
export default Review

/* *****
FAKE DATA GENERATOR: Review
******/
const dummyReviews = (min) => {
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
export { dummyReviews }
