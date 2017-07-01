import mongoose from 'mongoose'
import faker from 'faker'

const DecisionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  //  A decision for a proposal. Gets revised in case of amendments.
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  //  Author, typically the chair or proposal officer
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  //  Optional description that comes with the decision. "We liked..."
  body: String,
  //  Final decision
  approved: { type: Boolean, required: true },
  //  If this decision is an award, it will have a grant amount and associated report.
  grant: Number
})
const Decision = mongoose.model('Decision', DecisionSchema)
export default Decision

/* *****
FAKE DATA GENERATOR: Contact
***** */
const dummyDecisions = (min) => {
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
          grant: faker.random.number()
        })
      }
      //  Create will push our fakes into the DB.
      Decision.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Decision (${fakes.length})`) }
      })
    }
  })
}

export { dummyDecisions }
