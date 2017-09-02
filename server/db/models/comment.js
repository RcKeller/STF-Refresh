import mongoose from 'mongoose'
import autoref from 'mongoose-autorefs'
import autopopulate from 'mongoose-autopopulate'
import faker from 'faker'

const CommentSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
  //  Default titles since this is a new feature
  title: { type: String, required: true, default: '' },
  body: { type: String, required: true }
})
CommentSchema.plugin(autoref, [
  'proposal.comments'
  //  We don't track comments per user
])
CommentSchema.plugin(autopopulate)
const Comment = mongoose.model('Comment', CommentSchema)
export default Comment

/* *****
FAKE DATA GENERATOR: Comment
***** */
const dummyComments = (min, ids) => {
  //  Check the db for existing data satisfying min required
  Comment.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Comment schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Comment({
          _id: ids.comment[i],
          date: faker.date.recent(),
          proposal: ids.proposal[i],
          user: ids.user[i],
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
