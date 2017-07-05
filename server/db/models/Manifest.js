import mongoose from 'mongoose'
import autoref from 'mongoose-autorefs'
import faker from 'faker'

const ManifestSchema = new mongoose.Schema({
  //  NOTE: The original manifest is manitfests[0] in a proposal.
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  // Is this the initial proposition? If not, it's a "partial" manifest for what was actually funded.
  // Items in the manifest.
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  // Total cost, should be calculated dynamically.
  total: { type: Number, required: true, default: 0 }
})
ManifestSchema.plugin(autoref, ['items.manifest'])
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
          items: [
            ids.item[i],
            ids.item[i]
          ],
          total: faker.random.number()
        })
      }
      //  Create will push our fakes into the DB.
      Manifest.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Manifest (${fakes.length})`) }
      })
    }
  })
}

export { dummyManifests }
