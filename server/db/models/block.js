import mongoose from 'mongoose'
import autoref from 'mongoose-autorefs'
import faker from 'faker'

/*
BLOCK SCHEMA:
Contains the metadata AND content for continuous funding projects
known as "blocks" in the STF nomenclature
*/
const BlockSchema = new mongoose.Schema({
  /*
  _id and _v(ersion) are populated by mongoose, but I think this
  might be a good field to fill manually, prevents namespace issues later.
  */
  date: { type: Date, default: Date.now },
  year: Number,
  number: Number,
  published: { type: Boolean, default: false },

  title: String,
  category: String,
  organization: String,

  status: { type: String, default: 'Approved' },
  // "Estimated Yearly Ask"
  asked: Number,
  received: Number,

  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
  /*
  Body contains the business case/details, de-coupled from the core doc so that searching proposals is more efficient.
  While it has its similarities, this is decoupled because Blocks are distinct entities we don't want associated with standard proposals. Coupling their subdocuments introduces undue complexity to the query process.
  (as of today, we've only funded 3 blocks).
  */
  body: {
    //  "Block Induction Invitation"
    invitation: String,
    overview: {
      history: String,
      //  "Vision Statement"
      vision: String,
      goals: String
    },
    //  Business Plan
    plan: {
      //  "Structure"
      structure: String,
      //  "Services Provided"
      services: String,
      //  "Accessibility & Usage"
      accessibility: String
    },
    funding: {
      //  "Justification"
      budget: String,
      //  "Scope of Funding"
      scope: String,
      //  "External Support"
      external: String
    },
    reliability: {
      //  "Turnover Plan"
      risks: String,
      //  "Contingency Plan"
      mitigations: String
    }
  }
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
          organization: faker.commerce.department(),
          status: faker.company.bsAdjective(),
          asked: faker.random.number(),
          received: faker.random.number(),
          contacts: [
            ids.contact[i],
            ids.contact[i]
            //  Note: duplicates
          ],
          body: {
            invitation: faker.lorem.paragraph(),
            overview: {
              history: faker.lorem.paragraph(),
              vision: faker.lorem.paragraph(),
              goals: faker.lorem.paragraph()
            },
            plan: {
              structure: faker.lorem.paragraph(),
              services: faker.lorem.paragraph(),
              accessibility: faker.lorem.paragraph()
            },
            funding: {
              budget: faker.lorem.paragraph(),
              scope: faker.lorem.paragraph(),
              external: faker.lorem.paragraph()
            },
            reliability: {
              risks: faker.lorem.paragraph(),
              mitigations: faker.lorem.paragraph()
            }
          }
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
