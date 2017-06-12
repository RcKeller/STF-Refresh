import faker from 'faker'
import Case from '../models/case'

/*
FAKE DATA GENERATOR: Case
*/
export default function dummyCases (min) {
  //  Check the db for existing data satisfying min required
  Case.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Case schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Case({
          overview: {
            abstract: faker.lorem.paragraph(),
            objectives: [
              faker.lorem.sentence(),
              faker.lorem.sentence()
            ],
            justification: faker.lorem.paragraph()
          },
          plan: {
            state: [
              faker.lorem.paragraph(),
              faker.lorem.paragraph()
            ],
            availability: [
              faker.lorem.paragraph(),
              faker.lorem.paragraph()
            ],
            strategy: [
              faker.lorem.paragraph(),
              faker.lorem.paragraph()
            ],
            outreach: [
              faker.lorem.paragraph(),
              faker.lorem.paragraph()
            ],
            risk: [
              faker.lorem.paragraph(),
              faker.lorem.paragraph()
            ]
          },
          legacy: [
            {
              title: faker.company.catchPhrase(),
              body: faker.lorem.paragraph()
            },
            {
              title: faker.company.catchPhrase(),
              body: faker.lorem.paragraph()
            }
          ]
        })
      }
      //  Create will push our fakes into the DB.
      Case.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Case (${fakes.length})`) }
      })
    }
  })
}
