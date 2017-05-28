/* Initializing passport.js */
import passport from 'passport';
import google from './google';
import uw from './uw';
import db from '../../db';

const googleAuth = typeof db.passport.google === 'function'
const uwAuth = typeof db.passport.uw === 'function'

export default () => {
  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  The
  // typical implementation of this is as simple as supplying the user ID when
  // serializing, and querying the user record by ID from the database when
  // deserializing.

  if (db.passport && db.passport.deserializeUser) {
    if (googleAuth) {
      passport.serializeUser((user, done) => {
        done(null, user.id);
      });

      passport.deserializeUser(db.passport.deserializeUser);
    } else {
      console.warn('Error: MongoDB failed to (de)serialize Google User');
    }
    if (uwAuth) {
      passport.serializeUser((user, done) => {
        done(null, user.id);
      });

      passport.deserializeUser(db.passport.deserializeUser);
    } else {
      console.warn('Error: MongoDB failed to (de)serialize UW User');
    }
  }

  // use the following strategies
  google(passport);
  // uw(passport);
};
