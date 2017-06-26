/**
 * Defining a User Model in mongoose
 * Code modified from https://github.com/sahat/hackathon-starter
 */
import mongoose from 'mongoose'
const UserSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  netID: { type: String, unique: true, lowercase: true },
  email: { type: String, unique: true, lowercase: true },
  /*
  The commitee(orization) object will not pass to the client unless
  there's some sort of elevated privlege. Delete this object to remove
  a member's entire association with this org, assign or adjust to change privlege.
  */
  committee: {
    spectator: Boolean,
    member: Boolean,
    admin: Boolean
  },
  // Tokens and the google object are used by Oauth for the google (dev) strategy
  tokens: Array,
  google: Object
})
const User = mongoose.model('User', UserSchema)
export default User

/* *****
FAKE DATA GENERATOR: User
NOTE: This is totally custom. It gives accounts the devs can control different authZ levels.
******/
const dummyUsers = (min) => {
  //  Check the db for existing data satisfying min required
  const admin = new User({
    name: 'Ryan Keller',
    netID: 'rykeller',
    email: 'rykeller@uw.edu',
    committee: {
      spectator: true,
      member: true,
      admin: true
    }
  })
  const general = new User({
    name: 'John Doe',
    netID: 'stfcweb',
    email: 'stfcweb@uw.edu',
    committee: {
      spectator: false,
      member: false,
      admin: false
    }
  })
  //  Create will push our fakes into the DB.
  User.create([admin, general], (error) => {
    if (!error) {
      console.log(`SEED: Created admin and student account authZ`)
      console.log(`rykeller: Spectator, Member & Admin`)
      console.log(`stfcweb: General public`)
    }
  })
}
export { dummyUsers }
