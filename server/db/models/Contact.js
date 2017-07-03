import mongoose from 'mongoose'
import faker from 'faker'

const ContactSchema = new mongoose.Schema({
  // Contact info for associated proposal
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  //  Role is the person's association - Primary (contact), Budget, official (dean), Student
  role: { type: String, required: true },
  name: { type: String, required: true },
  netID: { type: String, required: true },
  title: { type: String, required: true },
  //  Client can handle string->number logic, since it's JS this is trivial.
  phone: String,
  mailbox: String,
  //  Have they signed the proposal?
  signature: { type: Boolean, default: false }
})
const Contact = mongoose.model('Contact', ContactSchema)
export default Contact

/* *****
FAKE DATA GENERATOR: Contact
***** */
const dummyContacts = (min, ids) => {
  //  Check the db for existing data satisfying min required
  Contact.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Contact schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Contact({
          _id: ids.contact[i],
          proposal: ids.proposal[i],
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
      Contact.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Contact (${fakes.length})`) }
      })
    }
  })
}
export { dummyContacts }
