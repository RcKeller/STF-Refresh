import mongoose from 'mongoose'
import faker from 'faker'

const ManifestSchema = new mongoose.Schema({
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  // Is this the initial proposition? If not, it's a "partial" manifest for what was actually funded.
  original: { type: Boolean, default: false },
  // Items in the manifest.
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],

  subtotal: { type: Number, required: true, default: 0 },
  //  Tax rate, used to automatically account for tax.
  tax: { type: Number, required: true, default: 10.1, min: 0 },
  //  Total cost.
  total: { type: Number, required: true, default: 0 }
})
const Manifest = mongoose.model('Manifest', ManifestSchema)
export default Manifest

/* *****
FAKE DATA GENERATOR: Contact
***** */
const dummyManifests = (min) => {
  //  Check the db for existing data satisfying min required
  Manifest.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Manifest schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Manifest({
          proposal: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
          original: faker.random.boolean(),
          items: [
            new mongoose.Types.ObjectId(),  // THIS IS RANDOM
            new mongoose.Types.ObjectId()
          ],
          subtotal: faker.random.number(),
          tax: faker.random.number(),
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
