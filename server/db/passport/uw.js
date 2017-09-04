import User from '../models/user'
//  NOTE: NetId is case sensitive (rest of the app uses netID)

/*
Serializeuser verifies that a user exists, and creates it if it doesn't.
NOTE: Shib's standard response for serializeUser data:
{ regId, netId, displayName, email },
[Function: serialized]
done(user) returns the user to be serialized/hydrated
We have to make do with this, but it's plenty!
*/

const serializeUser = ({ regId, netId, givenName, displayName, email } = {}, done) => {
  // console.log('Called db/passport/uw.serializeUser', regId, netId, displayName, email)
  // console.log('Callback:', typeof done)
  const profile = {
    netID: netId,
    name: givenName || displayName,
    email
  }
  User
    .findOne({ netID: profile.netID })
    //  Returning users have their authZ with the STF populated.
    // .populate('stf')
    .exec((findByNetIDErr, existingUser) => {
      console.log('SHIB-TEST: Found user:', existingUser)
      if (existingUser) {
        return done(null, existingUser)
      } else {
        console.log('SHIB-TEST: Creating user', profile)
        return User
          .create(profile)
          .then(user => done(null, user, { message: 'New NetID saved!' }))
        //  BUG: Returning to /login/undefined, otherwise functional
      }
    })
}

/*
deserializeUser: Takes the netID returned by serialize and hydrates it with currnet data and authZ
*/
const deserializeUser = ({ netID }, done) => {
  console.warn('db/passport/uw.deserializeUser:', netID, typeof done)
  User
    .findOne({ netID })
    .populate('stf')
    .exec((err, user) => done(err, user))
}

export default { serializeUser, deserializeUser }
/* eslint-enable no-param-reassign */
