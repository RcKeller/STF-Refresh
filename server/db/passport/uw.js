import User from '../models/user'

/*
NOTE: Shib calls are like so (logging (...args) and console.log(args))
GET /login 302 159.081 ms - 0
Called db/passport/uw.serializeUser [ { regId: 'F1199B3EB6BB4C35AC3AFBFD8F516054',
    netId: 'stfcweb',
    displayName: 'STF Webmaster',
    email: 'stfcweb@uw.edu' },
  [Function: serialized] ]
*/
// const serializeUser = (...args) => {
const serializeUser = ({ regId, netId, displayName, email } = {}, done) => {
  console.log('Called db/passport/uw.serializeUser', regId, netId, displayName, email)
  console.log('Callback:', typeof done)
  return {}
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
const deserializeUser = ({ netId, displayName, email } = {}, done) => {
  console.warn('db/passport/uw.deserializeUser:', netId, displayName, email)
  // User.findById(netId, (err, user) => {
  User.findOne({ netID: netId }, (err, user) => {
    done(err, user)
  })
}

export default { serializeUser, deserializeUser }
/* eslint-enable no-param-reassign */
