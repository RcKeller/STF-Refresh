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
  console.log('Called db/passport/uw.serializeUser', regId, netId, displayName, email)
  console.log('Callback:', typeof done)
  const profile = {
    netID: netId,
    name: givenName || displayName,
    email
  }

  //  CASE: User is logged in
  if (profile.netID) {
    console.warn('SHIB-TEST: has netId')
    // Check if there is an existing account with a provider id.
    User
      .findOne({ netID: profile.netId }, (findOneErr, existingUser) => {
        console.warn('SHIB-TEST: Logged in w/ Existing user', existingUser)
      // If there is, return an error message. (NetID Account merging not supported)
        return existingUser
          ? done(null, false, { message: `You are already signed in as netID: ${existingUser.netID}` })
          : User
            .create(profile)
            .then((err, user) => done(err, user, { message: 'New NetID saved (via cached login data) !' }))
      })
  }

  // CASE: User is NOT logged in
  // Check if it's a returning user.
  console.warn('SHIB-TEST: no user')
  return User
    .findOne({ netID: profile.netID })
    //  Returning users have their authZ with the STF populated.
    .populate('stf')
    .exec((findByNetIDErr, existingUser) => {
      console.log('SHIB-TEST: Logged out w/ existingUser', existingUser)
      //  FIXME: The done statement is not returning when I have an existing user. Pop works.
      return existingUser
        ? done(null, existingUser)
        : User
          .create(profile)
          .then((err, user) => done(err, user, { message: 'New NetID saved!' }))
    })
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
const deserializeUser = ({ netId, displayName, givenName, email } = {}, done) => {
  console.warn('db/passport/uw.deserializeUser:', netId, givenName, email)
  User
    .findOne(
      { netID: netId },
      (err, user) => done(err, user)
    )
}

export default { serializeUser, deserializeUser }
/* eslint-enable no-param-reassign */
