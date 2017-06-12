import mongoose from 'mongoose'
import faker from 'faker'
import Contact from '../models/contact'

/*
FAKE DATA GENERATOR: Contact
*/
export default function dummyContacts (min) {
  //  Check the db for existing data satisfying min required
  Contact.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Contact schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Contact({
          proposal: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
          role: 'primary',
          name: faker.name.findName(),
          netID: faker.internet.userName(),
          email: faker.internet.email(),
          committee: {
            spectator: faker.random.boolean(),
            member: faker.random.boolean(),
            admin: faker.random.boolean()
          }
          //  Tokens/Google OAuth are dev exclusives.
        })
      }
      //  Create will push our fakes into the DB.
      Contact.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Contact (${fakes.length})`) }
      })
    }
  })
}
