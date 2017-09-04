import User from '../models/user'
//  NOTE: NetId is case sensitive (rest of the app uses netID)
/*
NOTE: Shib response for serializeUser:
{ regId, netId, displayName, email },
[Function: serialized]
/*
NOTE: Shib calls are like so (logging (...args) and console.log(args))
GET /login 302 159.081 ms - 0
Called db/passport/uw.serializeUser [ { regId: 'F1199B3EB6BB4C35AC3AFBFD8F516054',
    netId: 'stfcweb',
    displayName: 'STF Webmaster',
    email: 'stfcweb@uw.edu' },
  [Function: serialized] ]
*/
/*
GET /login 302 167.217 ms - 0
Called db/passport/uw.serializeUser FC97522683434706B95A72148B150508 rykeller Ryan C Keller rykeller@uw.edu
Callback: function
*/

const serializeUser = ({ regId, netId, givenName, displayName, email } = {}, done) => {
  //  Receive shib info
  console.log('Called db/passport/uw.serializeUser', regId, netId, displayName, email)
  console.log('Callback:', typeof done)
  const profile = {
    netID: netId,
    name: givenName || displayName,
    email
  }
  //  Check DB if exists.

  //  CASE: User is logged in
  if (profile.netID) {
    console.log('Searching for netId:', profile.netID)
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
          User
            .create(profile)
            .then(user => done(null, user, { message: 'New NetID saved!' }))
        }
      })
  }
  //  done(user) returns user objects to be serialized
}

/*
NOTE: Shib responses are like so:
db/passport/uw.deserializeUser: { regId: 'FC97522683434706B95A72148B150508',
netId: 'rykeller',
displayName: 'Ryan C Keller',
surname: 'Keller',
givenName: 'Ryan Christopher',
email: 'rykeller@uw.edu' }
*/
/*
//  NOTE: Shib response for deserializeUser:
{ regId, netId, displayName, surname, givenName, email },
[Function: serialized]
I only need three attributes. Please note, UW prefers givenName (user chosen and usually doesn't have middle initial)
*/
// const deserializeUser = ({ netId, displayName, givenName, email } = {}, done) => {
//   console.warn('db/passport/uw.deserializeUser:', netId, givenName, email)
// const deserializeUser = (user, done) => {
//   console.warn('db/passport/uw.deserializeUser:', user, typeof done)
//   User
//     .findOne(
//       { netID: netId },
//       (err, user) => done(err, user)
//     )
// }
const deserializeUser = ({ netID }, done) => {
  console.warn('db/passport/uw.deserializeUser:', netID, typeof done)
  User
    .findOne({ netID })
    .populate('stf')
    .exec((err, user) => done(err, user))
}

export default { serializeUser, deserializeUser }
/* eslint-enable no-param-reassign */
