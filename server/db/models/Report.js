import mongoose from 'mongoose'
import faker from 'faker'

const ReportSchema = new mongoose.Schema({
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  date: { type: Date, default: Date.now }
  // TODO: Iron out these details with a proposal officer.
})
const Report = mongoose.model('Report', ReportSchema)
export default Report

/* *****
FAKE DATA GENERATOR: Proposal
******/
const dummyReports = (min) => {
//  Check the db for existing data satisfying min required
  Report.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Report schema: ${err}`)
    } else if (count < min) {
    //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Report({
          proposal: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
          date: faker.date.recent()
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
