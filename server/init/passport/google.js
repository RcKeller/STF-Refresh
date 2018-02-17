import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import db from '../../db'
import config from 'config'

/*
CONFIG FILE: /config/default.json or /config/development.json
"google": {
  "clientID": "<...google id>.apps.googleusercontent.com",
  "clientSecret": "<...google secret>",
  "loginURL": "/auth/google",
  "callbackURL": "/auth/google/callback",
  "successRedirect": "/",
  "failureRedirect": "/"
}
*/
export default (app, passport) => {
  if (!db.passport || !db.passport.google || !typeof db.passport.google === 'function') {
    console.warn('Error: MongoDB unable to initialize passport-google-oauth')
    return
  } else {
    console.warn('MOCK: Initializing Google Oauth2 "Mock-Shibboleth"')
  }
  /*
  OAuth Strategy modified from
  https://github.com/sahat/hackathon-starter/blob/master/config/passport.js
  - User is already logged in.
   - Check if there is an existing account with a provider id.
     - If there is, return an error message. (Account merging not supported)
     - Else link new OAuth account with currently logged-in user.
  - User is not logged in.
   - Check if it's a returning user.
     - If returning user, sign in and we are done.
     - Else check if there is an existing account with user's email.
       - If there is, return an error message.
       - Else create a new account.
  The Google OAuth 2.0 authentication strategy authenticates
  users using a Google account and OAuth 2.0 tokens.
  The strategy requires a verify callback, which accepts these
  credentials and calls done providing a user, as well
  as options specifying a client ID, client secret, and callback URL.
  */
  const { clientID, clientSecret, loginURL, callbackURL, successRedirect, failureRedirect } = config.get('google')
  //  NOTE: Namespaces are "URL", case sensitive
  passport.use(new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL,
    passReqToCallback: true
  }, db.passport.google.serializeUser))

  //  NOTE: See above, we actually have to use the second arg for a secondary round of serialization (the first just strips out excess data)
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(db.passport.google.deserializeUser)

  /*
  Redirect the user to Google for authentication. When complete, Google
  will redirect the user back to the application at
  /auth/google/return
  Authentication with google requires an additional scope param, for more info go
  here https://developers.google.com/identity/protocols/OpenIDConnect#scope-param
  */
  app.get(
    loginURL,
    passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }
  ))
  /*
  Google will redirect the user to this URL after authentication. Finish the
  process by verifying the assertion. If valid, the user will be logged in.
  Otherwise, the authentication has failed.
  */
  app.get(
    callbackURL,
    passport.authenticate('google', {
      successRedirect, failureRedirect
    })
  )
  console.log('MOCK: Google "Mock-Shibboleth" Enabled')
}
