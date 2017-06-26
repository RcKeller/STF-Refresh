import mongoose from 'mongoose'
import faker from 'faker'

const CommentSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  //  Default titles since this is a new feature
  title: { type: String, required: true, default: '' },
  body: { type: String, required: true }

})
const Comment = mongoose.model('Comment', CommentSchema)
export default Comment

/* *****
FAKE DATA GENERATOR: Comment
***** */
const dummyComments = (min) => {
  //  Check the db for existing data satisfying min required
  Comment.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Comment schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Comment({
          date: faker.date.recent(),
          user: new mongoose.Types.ObjectId(),
          proposal: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
          title: faker.company.catchPhrase(),
          body: faker.lorem.paragraph()
        })
      }
      //  Create will push our fakes into the DB.
      Comment.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Comment (${fakes.length})`) }
      })
    }
  })
}

export { dummyComments }
