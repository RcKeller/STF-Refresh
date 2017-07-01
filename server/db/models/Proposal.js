import mongoose from 'mongoose'
import faker from 'faker'

const ProposalSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  /*
  _id and _v(ersion) are populated by mongoose, but I think this
  might be a good field to fill manually, prevents namespace issues later.
  NOTE: Edit, that is not the case, these are CUID's
  */
  year: { type: Number, required: true },
  number: { type: Number, required: true },
  quarter: String,
  //  Overall data, probably renders everywhere.
  title: { type: String, unique: true, required: true },
  category: { type: String, required: true },
  // UAC === uniform access / tri-campus.
  uac: { type: Boolean, default: false },
  // organization === department in legacy code. This is more inclusive.
  organization: { type: String, required: true },
  //  Proposal status, differs from decisions in that this is "summary" data for table viewing.
  status: { type: String, default: 'In Review' },
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
  */
  manifests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Manifest' }],
  /*
  Amendments, AKA "supplementals", are revisions to the original propsal.
  These will be shown as "updates" or revisions to the proposal, but don't
  necessarily mean the entire proposal was re-done.
  It's usually just a blurb, plus decision. In rare instances there are multiple.
  */
  amendments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amendment' }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  //  The decision contains details about the actual award, provisions, etc.
  //  NOTE: In the case of amendments, decisions will be changed to "pending review."
  //  We don't want edge cases where a proposal is viewable as approved, post-amendment.
  decision: { type: mongoose.Schema.Types.ObjectId, ref: 'Decision' },
  /*
  Comments are user endorsements of a proposal. They're abstracted out
  so that we can view "feeds" of endorsements and examine trends in user activity.
  */
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  // TODO: Reports (they're unclear to me). Renders in another tab.
  //  Edit: One proposal, one decision, one report.
  report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' }
})

const Proposal = mongoose.model('Proposal', ProposalSchema)
export default Proposal

/* *****
FAKE DATA GENERATOR: Proposal
******/
const dummyProposals = (min) => {
  //  Check the db for existing data satisfying min required
  Proposal.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Proposal schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Proposal({

          date: faker.date.recent(),
          year: 2017,
          number: faker.random.number(),
          quarter: 'Spring',

          title: faker.company.catchPhrase(),
          category: faker.name.jobArea(),
          uac: faker.random.boolean(),
          organization: faker.commerce.department(),

          status: faker.company.bsAdjective(),
          asked: faker.random.number(),
          received: faker.random.number(),

          contacts: [
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId()
          ],
          body: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
          manifests: [
            new mongoose.Types.ObjectId(),  // THIS IS RANDOM
            new mongoose.Types.ObjectId()  // THIS IS RANDOM
          ],
          reviews: [
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId()
          ],
          decision: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
          amendments: [
            new mongoose.Types.ObjectId()  // THIS IS RANDOM
          ],
          report: new mongoose.Types.ObjectId(),
          comments: [
            new mongoose.Types.ObjectId(),  // THIS IS RANDOM
            new mongoose.Types.ObjectId()  // THIS IS RANDOM
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
