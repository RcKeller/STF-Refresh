/* Initializing passport.js */
import passport from 'passport'
import config from 'config'
import db from '../../db'
import google from './google'
import uw from './uw'

export default () => {
  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  The
  // typical implementation of this is as simple as supplying the user ID when
  // serializing, and querying the user record by ID from the database when
  // deserializing.

  if (db.passport && db.passport.deserializeUser) {
    passport.serializeUser((user, done) => {
      done(null, user.id)
    })

    passport.deserializeUser(db.passport.deserializeUser)
  } else {
    console.warn(unsupportedMessage('(de)serialize User'))
  }

  // Load strategies based on the env
  if (config.has('google')) { google(passport) }
  if (config.has('uw')) { uw(passport) }
  // local(passport);
}
