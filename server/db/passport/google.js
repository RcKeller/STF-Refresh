import User from '../models/user'

/* eslint-disable no-param-reassign */
export default (req, accessToken, refreshToken, profile, done) => {
  let p = profile._json
  let userData = {
    name: p.displayName,
    netID: p.emails[0].value,
    email: p.emails[0].value,
    google: p.id,
    tokens: { kind: 'google', accessToken }
  }
  console.log('USERDATA', userData)
// User is already logged in.
// Check if there is an existing account with a provider id.
// If there is, return an error message. (Account merging not supported)
// Else link new OAuth account with currently logged-in user.
// User is not logged in.
// Check if it's a returning user.
// If returning user, sign in and we are done.
// Else check if there is an existing account with user's email.
// If there is, return an error message.
// Else create a new account.
  console.log('===PROFILE===', profile.id, profile._json)
  const email = profile._json.emails[0].value
  const netID = email.split('@')[0]
  if (req.user) {
    // return User.findOne({ google: profile.id }, (findOneErr, existingUser) => {
    return User.findOne({ netID }, (findOneErr, existingUser) => {
      if (existingUser) {
        console.log('existingUser by netID', existingUser)
        return done(null, false, { message: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' })
      }
      return User.findById(req.user.id, (findByIdErr, user) => {
        console.log('found by id', req.user.id, user)
        const parsedEmail = profile._json.emails[0].value
        user.name = profile.displayName
        user.netID = parsedEmail.split('@')[0]
        user.email = parsedEmail
        user.google = profile.id
        user.tokens.push({ kind: 'google', accessToken })
        user.save((err) => {
          done(err, user, { message: 'Google account has been linked.' })
        })
      })
    })
  }
  return User.findOne({ netID }, (findByGoogleIdErr, existingUser) => {
    if (existingUser) {
      console.log('existingUser by googleID', existingUser)
      return done(null, existingUser)
    }
    return User.findOne({ netID }, (findByEmailErr, existingEmailUser) => {
      if (existingEmailUser) {
        // console.log('existingEmailUser', existingEmailUser)
        return done(null, false, { message: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' })
      }
      const parsedEmail = profile._json.emails[0].value
      const user = new User()

      user.name = profile.displayName
      // Simulate a netID by splitting the e-mail address. Genius!
      user.netID = parsedEmail.split('@')[0]
      user.email = parsedEmail
      user.google = profile.id
      user.tokens.push({ kind: 'google', accessToken })
      // console.log('Created user profile??', user)
      return user.save((err) => {
        done(err, user)
      })
    })
  })
}
/* eslint-enable no-param-reassign */
