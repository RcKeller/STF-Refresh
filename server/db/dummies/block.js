import mongoose from 'mongoose'
import faker from 'faker'
import Block from '../models/block'

/*
FAKE DATA GENERATOR: Block
*/
export default function dummyBlocks (min) {
  //  Check the db for existing data satisfying min required
  Block.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Block schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Block({
          date: faker.date.recent(),
          year: 2017,
          number: faker.random.number(),
          title: faker.company.catchPhrase(),
          category: faker.name.jobArea(),
          uac: faker.random.boolean(),
          organization: faker.commerce.department(),
          contacts: [
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId()
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
