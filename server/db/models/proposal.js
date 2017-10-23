import mongoose from 'mongoose'
import autoref from 'mongoose-autorefs'
// import autopopulate from 'mongoose-autopopulate'
//  BUG: autopopulate was causing children to be autoref'd multiple times even if set to unique:true
import faker from 'faker'

const ProposalSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  /*
  _id and _v(ersion) are populated by mongoose, but I think this
  might be a good field to fill manually, prevents namespace issues later.
  NOTE: Edit, that is not the case, these are CUID's
  */
  year: Number,
  number: Number,
  quarter: String,
  published: { type: Boolean, default: false },
  /*
  Every proposal MUST have a budget CODE. Planning and Budgeting needs this.
  Later, awards will be dispersed with budget NUMBERS (!== codes) for reporting.
  */
  budget: String,
  //  Overall data, probably renders everywhere.
  title: String,
  category: String,
  // UAC === uniform access / tri-campus.
  uac: { type: Boolean, default: false },
  //  Fast === FastTrack, an old process that's not well defined but must be documented.
  fast: { type: Boolean, default: false },
  // organization === department in legacy code. This is more inclusive.
  organization: String,
  //  Proposal status, differs from decisions in that this is "summary" data for table viewing.
  status: { type: String, default: 'Draft' },
  asked: Number,
  received: Number,
  // Contacts - array of objects, can iterate over via client with Object.keys().forEach(k, i) {}
  //  NOTE: Although it doesn't make sense for this to be an array vs an object, this makes our scheme
  //  more agnostic, since the contacts required may change as the proposal process evolves.
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
  // Body contains the Project Plan, de-coupled from the core doc so that searching proposals is more efficient.
  body: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  /*
  Manifests are the items requested. The first in the array is the ORIGINAL.
  the others are PARTIAL or revised manifests that reflect what is actually funded.
  Then there are SUPPLEMENTALS, which are like mini awards made after the initial grant to meet unforseen needs.
  */
  manifests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Manifest' }],
  /*
  Comments are user endorsements of a proposal. They're abstracted out
  so that we can view "feeds" of endorsements and examine trends in user activity.
  */
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
})
/*
Metadata
Contacts
Body (Overview / Project Plan)
Manifests
Stynax: <parent-to-child prop>.<child-to-parent prop>
*/
ProposalSchema.plugin(autoref, [
  'contacts.proposal',
  'body.proposal',
  'manifests.proposal',
  'comments.proposal'
])
// ProposalSchema.plugin(autopopulate)
const Proposal = mongoose.model('Proposal', ProposalSchema)
export default Proposal

/* *****
FAKE DATA GENERATOR: Proposal
******/
const dummyProposals = (min, ids) => {
  //  Check the db for existing data satisfying min required
  Proposal.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Proposal schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Proposal({
          _id: ids.proposal[i],
          date: faker.date.recent(),
          year: 2017,
          number: faker.random.number(),
          quarter: 'Spring',
          published: true,
          budget: faker.random.number(),

          title: faker.company.catchPhrase(),
          category: faker.name.jobArea(),
          uac: faker.random.boolean(),
          fast: faker.random.boolean(),
          organization: faker.commerce.department(),

          status: faker.company.bsAdjective(),
          asked: faker.random.number(),
          received: faker.random.number(),

          contacts: [
            ids.contact[i],
            ids.contact[i],
            ids.contact[i],
            ids.contact[i]
          ],
          body: ids.project[i],
          manifests: [
            ids.manifest[i],
            ids.manifest[i]
          ],
          reports: [
            ids.report[i],
            ids.report[i]
          ],
          comments: [
            ids.comment[i],
            ids.comment[i]
          ]
        })
      }
      //  Create will push our fakes into the DB.
      Proposal.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Proposal (${fakes.length})`) }
      })
    }
  })
}

export { dummyProposals }
