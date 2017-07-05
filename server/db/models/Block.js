import mongoose from 'mongoose'
import autoref from 'mongoose-autorefs'
import faker from 'faker'

const BlockSchema = new mongoose.Schema({
  /*
  _id and _v(ersion) are populated by mongoose, but I think this
  might be a good field to fill manually, prevents namespace issues later.
  */
  date: { type: Date, default: Date.now },
  year: { type: Number, required: true },
  number: { type: Number, required: true },
  //  Overall data, probably renders everywhere.
  title: { type: String, unique: true, required: true },
  category: { type: String, required: true },
  uac: { type: Boolean, default: false }, // UAC === uniform access / tri-campus.
  organization: { type: String, required: true }, // === department in legacy code
  // Contacts - array of objects, can iterate over via client with Object.keys().forEach(k, i) {}
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
  status: { type: String, default: 'In Review' },
  asked: Number,
  received: Number,
  /*
  Body contains the business case/details, de-coupled from the core doc so that searching proposals is more efficient.
  While it has its similarities, this is decoupled because Blocks are distinct entities we don't want associated with standard proposals. Coupling their subdocuments introduces undue complexity to the query process.
  (as of today, we've only funded 3 blocks).
  */
  body: {
    overview: {
      abstract: { type: String, required: true },
      objectives: [{ type: String, required: true }]
    },
    plan: {
      state: { type: String, required: true },
      strategy: { type: String, required: true },
      risk: { type: String, required: true }
    }
  }
  //  Proposal status, differs from decisions in that this is "summary" data for table viewing.
})
BlockSchema.plugin(autoref, ['contacts.block'])
const Block = mongoose.model('Block', BlockSchema)
export default Block

/* *****
FAKE DATA GENERATOR: Block
***** */
const dummyBlocks = (min, ids) => {
  //  Check the db for existing data satisfying min required
  Block.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Block schema: ${err}`)
    } else if (count < min) {
        //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Block({
          _id: ids.block[i],
          date: faker.date.recent(),
          year: 2017,
          number: faker.random.number(),
          title: faker.company.catchPhrase(),
          category: faker.name.jobArea(),
          uac: faker.random.boolean(),
          organization: faker.commerce.department(),
          contacts: [
            ids.contact[i],
            ids.contact[i]
            //  Note: duplicates
          ],
          body: {
            overview: {
              abstract: faker.lorem.paragraph(),
              objectives: [
                faker.lorem.sentence(),
                faker.lorem.sentence()
              ]
            },
            plan: {
              state: faker.lorem.paragraph(),
              strategy: faker.lorem.paragraph(),
              risk: faker.lorem.paragraph()
            }
          },
          status: faker.company.bsAdjective(),
          asked: faker.random.number(),
          received: faker.random.number()
        })
      }
        //  Create will push our fakes into the DB.
      Block.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Block (${fakes.length})`) }
      })
    }
  })
}

export { dummyBlocks }
