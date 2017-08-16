import mongoose from 'mongoose'
import faker from 'faker'

const ConfigSchema = new mongoose.Schema({
  //  Submissions: Open or closed (default to open)
  submissions: { type: Boolean, default: true },
  //  Recognized campus orgs (mech engineering dept, etc)
  organizations: [{ type: String }],
  //  Frontpage announcements
  announcements: [{
    type: String,
    default: ['Announcement 0', 'Announcement 1', 'Announcement 2']
  }],
  //  Stage: Where we are on the frontpage timeline (voting, deliberation, etc)
  stage: String,
  questions: {
    review: [{
      type: String,
      default: ['Placeholder A', 'Placeholder B']
    }]
  }
})
const Config = mongoose.model('Config', ConfigSchema)
export default Config

/* *****
FAKE DATA GENERATOR: Contact
***** */
//  NOTE: Min should = 1
const dummyConfigs = (min, ids) => {
  //  Check the db for existing data satisfying min required
  Config.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Config schema: ${err}`)
    } else if (count < 1) {
      let fake = new Config({
        submissions: true,
        organizations: [
          faker.company.bsNoun(),
          faker.company.bsNoun()
        ],
        announcements: [
          faker.lorem.paragraph(),
          faker.lorem.paragraph()
        ],
        stage: faker.company.bsNoun()
      })
      Config.create(fake, (error) => {
        if (!error) { console.log(`SEED: Created fake Config scheme`) }
      })
    }
  })
}

export { dummyConfigs }
