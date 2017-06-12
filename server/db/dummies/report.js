import mongoose from 'mongoose'
import faker from 'faker'
import Report from '../models/report'

/*
FAKE DATA GENERATOR: Report
*/
export default function dummyReports (min) {
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
