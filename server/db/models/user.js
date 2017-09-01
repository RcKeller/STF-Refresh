// https://github.com/sahat/hackathon-starter
import mongoose from 'mongoose'
import autoref from 'mongoose-autorefs'
import autopopulate from 'mongoose-autopopulate'
import faker from 'faker'

const UserSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  netID: { type: String, unique: true, lowercase: true },
  email: { type: String, unique: true, lowercase: true },
  /*
  The commitee(orization) object will not pass to the client unless
  there's some sort of elevated privlege. Delete this object to remove
  a member's entire association with this org, assign or adjust to change privlege.
  NOTE: This should stay in the user schema.
  A join for each authN action is a very expensive operation detrimental to UX.
  */
  stf: { type: mongoose.Schema.Types.ObjectId, ref: 'STF', autopopulate: true },
  /*
  Tokens and the google object are used by Oauth for the google (dev) strategy
  NOTE: These will never actually show up in production.
  */
  tokens: Array,
  google: Object
})
UserSchema.plugin(autoref, ['stf.user'])
UserSchema.plugin(autopopulate)
const User = mongoose.model('User', UserSchema)
export default User

/* *****
FAKE DATA GENERATOR: User
******/
const dummyUsers = (min, ids, developer) => {
  //  Check the db for existing data satisfying min required
  User.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Decision schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new User({
          _id: ids.user[i],
          name: faker.name.findName(),
          netID: faker.internet.userName(),
          email: faker.internet.email(),
          stf: ids.stf[i]
        })
      }
      //  Create a special user for the webdev's profile
      fakes.push(new User({...developer}))
      //  Create will push our fakes into the DB.
      User.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake User (${fakes.length})`) }
      })
    }
  })
}
export { dummyUsers }
