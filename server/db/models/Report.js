import mongoose from 'mongoose'
import autoref from 'mongoose-autorefs'
import autopopulate from 'mongoose-autopopulate'
import faker from 'faker'

/*
A report is a record of what was ACTUALLY purchased by proposal authors for a specific manifest (original/partial/supplemental).
*/
const ReportSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  //  Dates are automatically due one year from now with no exceptions.
  due: { type: Date, default: new Date().setFullYear(new Date().getFullYear() + 1) },
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  //  Autopopulate the original manifest.
  manifest: { type: mongoose.Schema.Types.ObjectId, ref: 'Manifest', autopopulate: true },
  /*
  Grants come with a brand new budget NUMBER for tracking expenditures
  We need this for Planning and Budgeting to check
  */
  budget: String,
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', autopopulate: true }],
  total: { type: Number, required: true, default: 0 }
})
ReportSchema.plugin(autoref, [
  'proposal.reports',
  'manifest.report',
  'item.report'
])
ReportSchema.plugin(autopopulate)
const Report = mongoose.model('Report', ReportSchema)
export default Report

/* *****
FAKE DATA GENERATOR: Report
******/
const dummyReports = (min, ids) => {
//  Check the db for existing data satisfying min required
  Report.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Report schema: ${err}`)
    } else if (count < min) {
    //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Report({
          _id: ids.report[i],
          date: faker.date.recent(),
          proposal: ids.proposal[i],
          manifest: ids.manifest[i],
          budget: faker.random.number(),
          items: [
            ids.item[i],
            ids.item[i]
          ],
          total: faker.random.number()
        })
      }
    //  Create will push our fakes into the DB.
      Report.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Report (${fakes.length})`) }
      })
    }
  })
}
export { dummyReports }
