import passport from 'passport'
import config from 'config'
import db from '../db'
//  Truthiness check - doesn't proceed until this resolves.
const version = config.get('version')
const controllers = db.controllers

//  GENERATE ROUTES
export default (app) => {
  /*
  RESTful API
  */
  app.use(`/${version}/contacts`, new controllers.Contacts().route())
  app.use(`/${version}/proposals`, new controllers.Proposals().route())
  app.use(`/${version}/projects`, new controllers.Projects().route())
  app.use(`/${version}/amendments`, new controllers.Amendments().route())
  app.use(`/${version}/manifests`, new controllers.Manifests().route())
  app.use(`/${version}/items`, new controllers.Items().route())
  app.use(`/${version}/blocks`, new controllers.Blocks().route())
  app.use(`/${version}/reviews`, new controllers.Reviews().route())
  app.use(`/${version}/decisions`, new controllers.Decisions().route())
  app.use(`/${version}/reports`, new controllers.Reports().route())
  app.use(`/${version}/comments`, new controllers.Comments().route())
  console.log(`REST: API live for all ${Object.keys(controllers).length - 1} core models.`)

  // USER PROFILE ROUTES
  if (controllers.Users) {
    app.delete('/sessions', controllers.Users.logout)
  } else { console.warn('Error: DB unable to handle user routes.') }
  //  PRODUCTION AUTH
  if (db.passport && config.has('uw')) {
    console.warn('WARNING: UW Shib specified in config, but routes/API not ready yet.')
    const uwCallback = config.get('uw.callbackURL')
    const shibPlaceholder = () => console.warn('Error - UW Shib not connected yet! In development.')
    app.get(uwCallback, shibPlaceholder)
    console.log('AUTH: Shibboleth Enabled')
  }
  //  DEV MODE MOCK AUTH
  if (db.passport && config.has('google')) {
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
