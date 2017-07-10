import mongoose from 'mongoose'
import autoref from 'mongoose-autorefs'
import autopopulate from 'mongoose-autopopulate'
import faker from 'faker'

const ReviewSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
  //  Comments included with the ratings. Equivalent of "notes"
  body: String,
  // Ratings are simple key-value stores, key is criteria, value is score.
  // This is because ratings are subjective, !== overall score, and volatile with business logic.
  ratings: [{
    prompt: String,
    score: Number
  }],
  //  Committee memeber's overall score for the proposal. Would be nice to have between 0-100 as stretch goal.
  score: Number,
  //  Pass or fail the proposal? This is separate, because we may pass things we don't agree with.
  approved: Boolean
})
ReviewSchema.plugin(autoref, ['proposal.reviews'])
ReviewSchema.plugin(autopopulate)
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
const dummyReviews = (min, ids) => {
  //  Check the db for existing data satisfying min required
  Review.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Review schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Review({
          _id: ids.review[i],
          date: faker.date.recent(),
          proposal: ids.proposal[i],
          author: ids.user[i],
          body: faker.lorem.paragraph(),
          ratings: [
            {
              prompt: faker.company.bsNoun(),
              score: faker.random.number()
            },
            {
              prompt: faker.company.bsAdjective(),
              score: faker.random.number()
            }
          ],
          score: faker.random.number(),
          approved: faker.random.boolean()
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
