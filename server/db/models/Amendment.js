import mongoose from 'mongoose'
import faker from 'faker'

const AmendmentSchema = new mongoose.Schema({
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  //  We only need one contact for an amendment. Let's not make it a heavily involved process.
  contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  title: { type: String, require: true },
  //  We want these BRIEF. Very BRIEF. Thus, no extensive plan, etc. This ends up as a headnote for proposals.
  body: { type: String, require: true }
})
const Amendment = mongoose.model('Amendment', AmendmentSchema)
export default Amendment

/* *****
FAKE DATA GENERATOR: Amendment
***** */
const dummyAmendments = (min) => {
  //  Check the db for existing data satisfying min required
  Amendment.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Amendment schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Amendment({
          proposal: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
          contact: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
          title: faker.company.catchPhrase(),
          body: faker.lorem.paragraph()
        })
      }
      //  Create will push our fakes into the DB.
      Amendment.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Amendment (${fakes.length})`) }
      })
    }
  })
}
export { dummyAmendments }
