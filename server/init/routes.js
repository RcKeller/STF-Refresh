import passport from 'passport'
import config from 'config'
import path from 'path'
import db from '../db'
const fs = require('fs')
//  Truthiness check - doesn't proceed until this resolves.
const version = config.get('version')
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
    //  NOTE: Good resource:
    //  https://github.com/drstearns/passport-uwshib
    console.warn('WARNING: UW Shib specified in config, but routes/API not ready yet.')
    // const uwCallback = config.get('uw.callbackURL')
    // const shibPlaceholder = () => console.warn('Error - UW Shib not connected yet! In development.')
    // app.get(uwCallback, shibPlaceholder)
    // console.log('AUTH: Shibboleth Enabled')

    var shib = require('passport-uwshib')
    var loginURL = config.get('uw.loginURL')
    var loginCallbackURL = config.get('uw.callbackURL')
    var strategyName = config.get('uw.strategyName')
    console.warn('DEV: Shib configs:', loginURL, loginCallbackURL, strategyName)

    const pubCertPath = path.resolve(process.cwd(), 'security', 'server-cert.pem')
    console.warn('DEV: Using pub cert path', pubCertPath)
    const pubCert = fs.readFileSync(pubCertPath, 'utf-8')

    app.get(loginURL, passport.authenticate(strategyName), shib.backToUrl())
    app.post(loginCallbackURL, passport.authenticate(strategyName), shib.backToUrl())
    app.get(shib.urls.metadata, shib.metadataRoute(strategyName, pubCert))
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
