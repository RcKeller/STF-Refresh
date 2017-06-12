import mongoose from 'mongoose'
import faker from 'faker'
import Proposal from '../models/proposal'

/*
FAKE DATA GENERATOR: Proposal
*/
export default function dummyProposals (min) {
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
          amendments: [
            new mongoose.Types.ObjectId()  // THIS IS RANDOM
          ],
          reports: [
            new mongoose.Types.ObjectId()  // THIS IS RANDOM
          ],
          decision: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
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
