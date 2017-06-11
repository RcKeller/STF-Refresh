import passport from 'passport'
import db from '../db'
import config from 'config'
const version = config.get('version')

/*
STANDARD CONTROLLERS:
These have core get/post/put/delete requests, the later 3 of which are tied to ID.
Routes are automatically mapped for core services, then custom ones get mapped later.
(BTW, we test the existence of the controller first. Prevents exceptions).
*/
const api = {
  contacts: db.controllers && db.controllers.contacts,
  blocks: db.controllers && db.controllers.blocks
}
/*
CUSTOM CONTROLLERS:
These don't contain core services, routes are bespoke.
*/
const usersController = db.controllers && db.controllers.users

//  GENERATE ROUTES
export default (app) => {
  //  CORE SERVICES
  Object.keys(api).forEach(function (key) {
    const service = api[key]
    if (typeof service !== 'undefined') {
      app.get(`/${version}/${key}`, service.all)
      app.post(`/${version}/${key}/:id`, service.add)
      app.put(`/${version}/${key}/:id`, service.update)
      app.delete(`/${version}/${key}/:id`, service.remove)
      console.log(`API:  Core services live for: ${key}`)
    } else { console.warn(`Error: DB unable to handle ${key} routes`) }
  })

  // USER PROFILE ROUTES
  if (usersController) {
    app.delete('/sessions', usersController.logout)
  } else { console.warn('Error: DB unable to handle user routes.') }
  //  PRODUCTION AUTH
  if (db.passport && config.has('uw')) {
    console.log('WARNING: UW Shib specified in config, but routes/API not ready yet.')
    const uwCallback = config.get('uw.callbackURL')
    const shibPlaceholder = () => console.log('Error - UW Shib not connected yet! In development.')
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
    const successRedirect = '/'
    const failureRedirect = '/login'
    app.get(
      googleCallback,
      passport.authenticate('google', { successRedirect, failureRedirect })
    )
    console.log('AUTH: Google "Psuedo-Auth" Enabled')
  }
}
