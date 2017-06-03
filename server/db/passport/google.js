import User from '../models/user'

/* eslint-disable no-param-reassign */
export default (req, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    return User.findOne({ google: profile.id }, (findOneErr, existingUser) => {
      if (existingUser) {
        return done(null, false, { message: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' })
      }
      return User.findById(req.user.id, (findByIdErr, user) => {
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
  return User.findOne({ google: profile.id }, (findByGoogleIdErr, existingUser) => {
    if (existingUser) return done(null, existingUser)
    return User.findOne({ email: profile._json.emails[0].value }, (findByEmailErr, existingEmailUser) => {
      if (existingEmailUser) {
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
      return user.save((err) => {
        done(err, user)
      })
    })
  })
}
/* eslint-enable no-param-reassign */
