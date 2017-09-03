import Shibboleth from 'passport-uwshib'
import fs from 'fs'
import path from 'path'
import config from 'config'
import db from '../../db'

//  Passport-UWShib is using commonJS, so don't try adding ES6 trickery here.
// var Shibboleth = require('passport-uwshib')

export default (app, passport) => {
  console.warn('SHIB: Initializing Shibboleth')
  //  NOTE: Good resource:
  //  https://github.com/drstearns/passport-uwshib
  if (!db.passport || !db.passport.google || !typeof db.passport.google === 'function') {
    console.warn('Error: MongoDB unable to initialize passport-google-oauth')
    return
  }

  const privateKey = fs.readFileSync(
    path.resolve(process.cwd(), 'security', 'server-pvk.pem'),
    'utf-8'
  )
  const pubCert = fs.readFileSync(
    path.resolve(process.cwd(), 'security', 'server-cert.pem'),
    'utf-8'
  )

  //  Shib wants a domain formatted like "uwstf.org:8090"
  const domain = `${config.get('domain')}:${config.get('port')}`
  //  Shib wants an entityID with the protocol like "https://uwstf.org:8090"
  const entityId = `${config.get('protocol')}://${domain}`
  //  Login url, like /login
  const loginUrl = '/login'
  //  Callback URL, e.g. /login/callback
  const callbackUrl = '/login/callback'
  console.warn(`SHIB: Domain and entity: ${domain} | ${entityId}`)
  console.warn(`SHIB: Login, callback and metadata: ${loginUrl} | ${callbackUrl} | ${Shibboleth.urls.metadata}`)

  var UWStrategy = new Shibboleth.Strategy({
    // entityId,
    entityId: 'https://uwstf.org:8090',
    privateKey: privateKey,
    callbackUrl: callbackUrl,
    domain: 'uwstf.org:8090'
    // domain
  }, db.passport.uw)
  //  NOTE: adding new serializeUser here?
  passport.use(UWStrategy)
  //  NOTE: Removed definition of serialize/deserialize here

  // serialize and deserialize the user's session
  //  TODO: How does this connect to the rest of the app?
  // passport.serializeUser(function (user, done) {
  //   console.log('Serialize user:', user)
  //   done(null, user)
  // })
  // passport.deserializeUser(function (user, done) {
  //   console.log('Deserialize user:', user)
  //   done(null, user)
  // })

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
  console.log('AUTH: Shibboleth Enabled')
}
