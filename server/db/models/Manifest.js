import mongoose from 'mongoose'
import autoref from 'mongoose-autorefs'
import autopopulate from 'mongoose-autopopulate'
import faker from 'faker'

const ManifestSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  //  NOTE: The original manifest is manitfests[0] in a proposal.
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
  //  Type: original, partial or supplemental
  type: String,
  //  Data included for supplementals
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
  title: String,
  body: String,
  // Is this the initial proposition? If not, it's a "partial" manifest for what was actually funded.
  // Items in the manifest.
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', autopopulate: true }],
  // Total cost, should be calculated dynamically.
  total: { type: Number, required: true, default: 0 },
  //  If the manifest is on the docket for a vote, and what kind.
  docket: {
    metrics: { type: Boolean, default: false },
    voting: { type: Boolean, default: false },
    decisions: { type: Boolean, default: false }
  },
  //  Reviews are taken for manifests.
  //  Decisions are issued for manifests (partial passed, supplemental passed), etc.
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  decision: { type: mongoose.Schema.Types.ObjectId, ref: 'Decision' }
})
ManifestSchema.plugin(autoref, [
  'proposal.manifests',
  'report.manifest',
  'items.manifest',
  'reviews.manifest',
  'decision.manifest'
])
ManifestSchema.plugin(autopopulate)
const Manifest = mongoose.model('Manifest', ManifestSchema)
export default Manifest

/* *****
FAKE DATA GENERATOR: Contact
***** */
const dummyManifests = (min, ids) => {
  //  Check the db for existing data satisfying min required
  Manifest.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Manifest schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Manifest({
          _id: ids.manifest[i],
          proposal: ids.proposal[i],
          block: ids.block[i],
          report: ids.report[i],
          user: ids.user[i],
          type: faker.random.boolean() ? 'original' : 'supplemental',
          title: faker.company.bsNoun(),
          body: faker.lorem.paragraph(),
          docket: {
            metrics: false,
            voting: false
          },
          reviews: [
            ids.review[i],
            ids.review[i]
          ],
          decision: ids.decision[i],
          items: [
            ids.item[i],
            ids.item[i]
          ],
          total: faker.random.number()
          //  By default, nothing's on the docket.
        })
        //  Some of these have been decided upon.
        if (faker.random.boolean()) {
          fakes[i].decision = ids.decision[i]
        }
      }
      //  Create will push our fakes into the DB.
      Manifest.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Manifest (${fakes.length})`) }
      })
    }
  })
}

export { dummyManifests }
