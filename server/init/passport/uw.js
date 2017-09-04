import Shibboleth from 'passport-uwshib'
import fs from 'fs'
import path from 'path'
import config from 'config'
import db from '../../db'

export default (app, passport) => {
  //  NOTE: Good resource:
  //  https://github.com/drstearns/passport-uwshib
  if (!db.passport || !db.passport.uw || !typeof db.passport.uw === 'function') {
    console.warn('Error: MongoDB unable to initialize passport-google-oauth')
    return
  } else {
    console.warn('SHIB: Initializing Shibboleth')
  }
  /*
  SAML 2.0 -> Shibboleth (UW) strategy credit to Dr. Stearns:
  https://github.com/drstearns/passport-uwshib
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
  Don't cross-ref this with google's mock authentication - it takes different params.
  After defining the strategy, we define serialize and deserialize functions that either find existing users or handle the creation/return of user profiles respectively.
  These certificates are NOT optional, and are provided when you register your server:
  https://iam-tools.u.washington.edu/spreg/
  The metadata must be available on a public route (see the final GET route declared here), and it's how Shib verifies your site creds.
  Why is this important? Well, you will never be able to connect to Shibboleth locally (that's the point), which is why I built a secondary OAuth2 authZ system for dev builds.
  */
  const privateKey = fs.readFileSync(
    path.resolve(process.cwd(), 'security', 'server-pvk.pem'),
    'utf-8'
  )
  const pubCert = fs.readFileSync(
    path.resolve(process.cwd(), 'security', 'server-cert.pem'),
    'utf-8'
  )
  /*
  Shib wants:
    -domain, formatted like "uwstf.org"
    -entityId, formatted like "https://uwstf.org"
      -Shib only works on HTTPS
    -loginUrl (CASE SENSITIVE, due to a bug with passport-uwshib) for outgoing requests
    -callbackUrl (CASE SENSITIVE) for incoming user profiles
  */
  const domain = `${config.get('domain')}:${config.get('port')}`
  const entityId = `https://${domain}`
  const loginUrl = '/login'
  const callbackUrl = '/login/callback'
  console.warn(`SHIB: Connecting as: ${entityId}`)
  console.warn(`SHIB: Login, Callback and Metadata routes: ${loginUrl} | ${callbackUrl} | ${Shibboleth.urls.metadata}`)

  var UWStrategy = new Shibboleth.Strategy({
    entityId,
    privateKey,
    callbackUrl,
    domain
  })
  passport.use(UWStrategy)
  //  NOTE: See above, unlike Oauth2 and other strategies, you define all your callback functions and only have serial/deserialize (easy!)
  passport.serializeUser(db.passport.uw.serializeUser)
  passport.deserializeUser(db.passport.uw.deserializeUser)

  //  Log in
  app.get(
    loginUrl,
    passport.authenticate(UWStrategy.name),
    Shibboleth.backToUrl()
  )
  //  Log out
  app.post(
    callbackUrl,
    passport.authenticate(UWStrategy.name),
    Shibboleth.backToUrl()
  )
  //  Shib validation of site metadata
  app.get(
    Shibboleth.urls.metadata,
    Shibboleth.metadataRoute(UWStrategy, pubCert)
  )
  console.log('SHIB: Shibboleth Enabled')
}
