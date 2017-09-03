import passport from 'passport'
import config from 'config'
import db from '../db'
import Shibboleth from 'passport-uwshib'
import fs from 'fs'
import path from 'path'
const version = config.get('version')
//  Truthiness check - doesn't proceed until this resolves.
const controllers = db.controllers

//  GENERATE ROUTES
export default (app) => {
  /*
  RESTful API
  */
  app.use(`/${version}/configs`, new controllers.Configs().api())
  app.use(`/${version}/contacts`, new controllers.Contacts().api())
  app.use(`/${version}/stf`, new controllers.STF().api())
  app.use(`/${version}/comments`, new controllers.Comments().api())
  app.use(`/${version}/proposals`, new controllers.Proposals().api())
  app.use(`/${version}/projects`, new controllers.Projects().api())
  app.use(`/${version}/manifests`, new controllers.Manifests().api())
  app.use(`/${version}/items`, new controllers.Items().api())
  app.use(`/${version}/blocks`, new controllers.Blocks().api())
  app.use(`/${version}/reviews`, new controllers.Reviews().api())
  app.use(`/${version}/decisions`, new controllers.Decisions().api())
  app.use(`/${version}/reports`, new controllers.Reports().api())
  console.log(`REST: API live for all ${Object.keys(controllers).length - 1} core models.`)

  // USER PROFILE ROUTES
  const Users = new controllers.Users()
  app.use(`/${version}/users`, Users.api())
  app.delete('/sessions', Users.logout)
  console.log(`REST: API live for Users.`)
  // } else { console.warn('Error: DB unable to handle user routes.') }

  //  PRODUCTION AUTH
  if (db.passport && config.has('prod')) {
    console.warn('SHIB: Initializing Shibboleth')
    //  NOTE: Good resource:
    //  https://github.com/drstearns/passport-uwshib

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
    })
    passport.use(UWStrategy)
    // serialize and deserialize the user's session
    //  TODO: How does this connect to the rest of the app?
    passport.serializeUser(function (user, done) {
      console.log('Serialize user:', user)
      done(null, user)
    })
    passport.deserializeUser(function (user, done) {
      console.log('Deserialize user:', user)
      done(null, user)
    })
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

  //  DEV MODE MOCK AUTH
  if (db.passport && config.has('dev')) {
    /*
    Redirect the user to Google for authentication. When complete, Google
    will redirect the user back to the application at
    /auth/google/return
    Authentication with google requires an additional scope param, for more info go
    here https://developers.google.com/identity/protocols/OpenIDConnect#scope-param
    */
    app.get('/auth/google', passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }))
    /*
    Google will redirect the user to this URL after authentication. Finish the
    process by verifying the assertion. If valid, the user will be logged in.
    Otherwise, the authentication has failed.
    */
    const googleCallback = config.get('google.callbackURL')
    // const successRedirect = '/login'
    const successRedirect = '/'
    const failureRedirect = '/'
    app.get(
      googleCallback,
      passport.authenticate('google', { successRedirect, failureRedirect })
    )
    console.log('AUTH: Google "Psuedo-Auth" Enabled')
  }
}
