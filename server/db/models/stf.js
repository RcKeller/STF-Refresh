import mongoose from 'mongoose'
import autoref from 'mongoose-autorefs'
import faker from 'faker'
/*
Schema for commitee members. These are deleted if members are no longer associated with the STF.
*/
const STFSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  spectator: Boolean,
  member: Boolean,
  admin: Boolean
})
STFSchema.plugin(autoref, ['user.stf'])
//  NOTE: Add autopop if nececssary, not needed for now.
const STF = mongoose.model('STF', STFSchema)
export default STF

/* *****
FAKE DATA GENERATOR: User
******/
const dummySTF = (min, ids, developer) => {
  //  Check the db for existing data satisfying min required
  STF.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Decision schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new STF({
          _id: ids.stf[i],
          user: ids.user[i],
          spectator: faker.random.boolean(),
          member: faker.random.boolean(),
          admin: faker.random.boolean()
        })
      }
      fakes.push(new STF({
        _id: developer.stf,
        user: developer._id,
        spectator: true,
        member: true,
        admin: true
      }))
      //  Create will push our fakes into the DB.
      STF.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake STF authZ (${fakes.length})`) }
      })
    }
  })
}
export { dummySTF }
