// import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import ShibStrategy from 'passport-uwshib';
import db from '../../db';
import config from 'config';

export default (passport) => {
  if (!db.passport || !db.passport.uw || !typeof db.passport.uw === 'function') {
    console.warn('Error: MongoDB unable to initialize passport-uwshib');
    return;
  }

  /*
  * OAuth Strategy taken modified from https://github.com/sahat/hackathon-starter/blob/master/config/passport.js
  *
  * - User is already logged in.
  *   - Check if there is an existing account with a provider id.
  *     - If there is, return an error message. (Account merging not supported)
  *     - Else link new OAuth account with currently logged-in user.
  * - User is not logged in.
  *   - Check if it's a returning user.
  *     - If returning user, sign in and we are done.
  *     - Else check if there is an existing account with user's email.
  *       - If there is, return an error message.
  *       - Else create a new account.
  *
  * The Google OAuth 2.0 authentication strategy authenticates
  * users using a Google account and OAuth 2.0 tokens.
  * The strategy requires a verify callback, which accepts these
  * credentials and calls done providing a user, as well
  * as options specifying a client ID, client secret, and callback URL.
  */
  const domain = `${config.get('domain')}:${config.get('port')}`
  const url = `${config.get('protocol')}://${domain}`
  passport.use(new ShibStrategy({
    entityId: url,
    domain,
    privateKey: config.get('key'),
    callbackURL: config.get('uw.callbackURL')
  }, db.passport.uw));
};
