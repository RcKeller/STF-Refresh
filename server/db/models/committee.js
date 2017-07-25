import mongoose from 'mongoose'
import autoref from 'mongoose-autorefs'
import faker from 'faker'
/*
Schema for commitee members. These are deleted if members are no longer associated with the committee.
*/
const CommitteeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  spectator: Boolean,
  member: Boolean,
  admin: Boolean
})
CommitteeSchema.plugin(autoref, ['user.commitee'])
const Committee = mongoose.model('Committee', CommitteeSchema)
export default Committee

/* *****
FAKE DATA GENERATOR: User
******/
const dummyCommittees = (min, ids) => {
  //  Check the db for existing data satisfying min required
  Committee.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Decision schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Committee({
          _id: ids.committee[i],
          spectator: faker.random.boolean(),
          member: faker.random.boolean(),
          admin: faker.random.boolean()
        })
      }
      //  Create will push our fakes into the DB.
      Committee.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Committe profile (${fakes.length})`) }
      })
    }
  })
}
export { dummyCommittees }
