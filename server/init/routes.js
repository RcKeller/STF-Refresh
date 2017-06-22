import express from 'express'
import restify from 'express-restify-mongoose'
import passport from 'passport'
import db from '../db'
import config from 'config'
/*
RESTful MODELS (sans-controller)
Controllers are automatically mapped using express-restify-mongoose
*/
import { restModels } from '../db/models' //  Models for REST routes
/*
CUSTOM CONTROLLERS:
Bespoke, non-RESTful routes for things like authN.
*/
const users = db.controllers && db.controllers.users

//  GENERATE ROUTES
export default (app) => {
  /*
  CORE REST API:
  https://florianholzapfel.github.io/express-restify-mongoose/
  Routes are generated for our core models per RESTful standards.
  We have full query capabilities for all these APIs. Can accept query params and process them accordingly.
  */
  //  Set defaults (removing /api prefix, setting /version)
  restify.defaults({ prefix: '', version: `/${config.get('version')}` })
  //  Initialize a router, map every core model's restify routes.
  const rest = express.Router()
  restModels.map((model) => restify.serve(rest, model))
  //  Now, we use the router!
  app.use(rest) && console.log(`REST: API live for all ${restModels.length} core models.`)

  // USER PROFILE ROUTES
  if (users) {
    app.delete('/sessions', users.logout)
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
    const successRedirect = '/'
    const failureRedirect = '/login'
    app.get(
      googleCallback,
      passport.authenticate('google', { successRedirect, failureRedirect })
    )
    console.log('AUTH: Google "Psuedo-Auth" Enabled')
  }
}
