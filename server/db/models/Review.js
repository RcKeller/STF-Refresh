import mongoose from 'mongoose'
import faker from 'faker'

const ReviewSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  body: String,
  //  Committee memeber's overall score for the proposal. Would be nice to have between 0-100 as stretch goal.
  score: Number,
  //  Pass or fail the proposal? This is separate, because we may pass things we don't agree with.
  decision: Boolean,
  // Ratings are simple key-value stores, key is criteria, value is score.
  // This is because ratings are subjective, !== overall score, and volatile with business logic.
  ratings: [{
    prompt: String,
    score: Number
  }]
})
const Review = mongoose.model('Review', ReviewSchema)
export default Review
/*
RATING QUESTIONS:
When we get to the relevant point in data migration, put a plain-english explaination of the possible rating
key-value pairs here.
NOTE:
*/

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
          date: faker.date.recent(),
          proposal: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
          user: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
          body: faker.lorem.paragraph(),
          score: faker.random.number(),
          decision: faker.random.boolean(),
          ratings: [
            {
              prompt: faker.company.bsNoun(),
              score: faker.random.number()
            },
            {
              prompt: faker.company.bsAdjective(),
              score: faker.random.number()
            }
          ]
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
