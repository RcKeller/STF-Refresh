import mongoose from 'mongoose'
import faker from 'faker'
import Comment from '../models/comment'

/*
FAKE DATA GENERATOR: Comment
*/
export default function dummyComments (min) {
  //  Check the db for existing data satisfying min required
  Comment.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Comment schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Comment({
          proposal: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
          user: new mongoose.Types.ObjectId(),
          title: faker.company.catchPhrase(),
          body: faker.lorem.paragraph(),
          date: faker.date.recent()
        })
      }
      //  Create will push our fakes into the DB.
      Comment.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Comment (${fakes.length})`) }
      })
    }
  })
}
