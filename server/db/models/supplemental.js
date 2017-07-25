import mongoose from 'mongoose'
import autoref from 'mongoose-autorefs'
import autopopulate from 'mongoose-autopopulate'
import faker from 'faker'

const SupplementalSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  //  We only need one contact for an Supplemental. Let's not make it a heavily involved process.
  contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', autopopulate: true },
  title: { type: String, require: true },
  //  We want these BRIEF. Very BRIEF. Thus, no extensive plan, etc. This ends up as a headnote for proposals.
  body: { type: String, require: true }
})
SupplementalSchema.plugin(autoref, [
  'proposal.Supplementals',
  'contact.Supplemental'
])
SupplementalSchema.plugin(autopopulate)
const Supplemental = mongoose.model('Supplemental', SupplementalSchema)
export default Supplemental

/* *****
FAKE DATA GENERATOR: Supplemental
***** */
const dummySupplementals = (min, ids) => {
  //  Check the db for existing data satisfying min required
  Supplemental.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Supplemental schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Supplemental({
          _id: ids.supplemental[i],
          proposal: ids.proposal[i],
          contact: ids.contact[i],
          title: faker.company.catchPhrase(),
          body: faker.lorem.paragraph()
        })
      }
      //  Create will push our fakes into the DB.
      Supplemental.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Supplemental (${fakes.length})`) }
      })
    }
  })
}
export { dummySupplementals }
