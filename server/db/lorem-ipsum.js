import mongoose from 'mongoose'
import config from 'config'
import faker from 'faker'

import Contact from './models/contact'
//  For faking Object ID's. THESE WILL BE RANDOM AND NOT POINT TO REAL DATA.

function dummyContacts (min) {
  //  Check the db for existing data satisfying min required
  Contact.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Contact schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakeContacts = []
      for (let i = 0; i < min; i++) {
        fakeContacts[i] = new Contact({
          proposal: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
          role: 'primary',
          netID: faker.internet.userName(),
          name: faker.name.findName(),
          title: faker.name.jobTitle(),
          phone: faker.phone.phoneNumber(),
          mailbox: faker.address.secondaryAddress(),
          signature: false
        })
      }
      //  Create will push our fakes into the DB.
      Contact.create(fakeContacts, (error) => {
        if (!error) { console.log(`SEED: Created fake contacts (${fakeContacts.length})`) }
      })
    }
  })
}

export default function () {
  const min = config.has('lorem-ipsum') ? config.get('lorem-ipsum') : 5 // default
  console.log(`SEED: Lorem Ipsum Mode enabled. Seeding up to ${min} documents each...`)

  dummyContacts(min)
}
