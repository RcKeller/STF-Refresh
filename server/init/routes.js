/**
 * Routes for express app
 */
import passport from 'passport'
import db from '../db'
import config from 'config'
const version = config.get('version')

const usersController = db.controllers && db.controllers.users
const contactsController = db.controllers && db.controllers.contacts
// const topicsController = db.controllers && db.controllers.topics

export default (app) => {
  // user routes
  if (usersController) {
    //  Log out from a session.
    app.delete('/sessions', usersController.logout)
  } else {
    console.warn('Error: DB unable to handle user routes.')
  }

  if (db.passport && config.has('google')) {
    // google auth
    // Redirect the user to Google for authentication. When complete, Google
    // will redirect the user back to the application at
    // /auth/google/return
    // Authentication with google requires an additional scope param, for more info go
    // here https://developers.google.com/identity/protocols/OpenIDConnect#scope-param
    app.get('/auth/google', passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }))
    // Google will redirect the user to this URL after authentication. Finish the
    // process by verifying the assertion. If valid, the user will be logged in.
    // Otherwise, the authentication has failed.
    const googleCallback = config.get('google.callbackURL')
    const successRedirect = '/'
    const failureRedirect = '/login'
    app.get(
      googleCallback,
      passport.authenticate('google', { successRedirect, failureRedirect })
    )
  }
  if (db.passport && config.has('uw')) {
    console.log('WARNING: UW Shib specified in config, but routes/API not ready yet.')
    const uwCallback = config.get('uw.callbackURL')
    const shibPlaceholder = () => console.log('Error - UW Shib not connected yet! In development.')
    app.get(uwCallback, shibPlaceholder)
  }
  //  CONTACTS controller
  if (contactsController) {
    app.get(`${version}/contacts`, contactsController.all)
    app.post(`${version}/contacts/:id`, contactsController.add)
    app.put(`${version}/contacts/:id`, contactsController.update)
    app.delete(`${version}/contacts/:id`, contactsController.remove)
  } else {
    console.warn('Error: DB unable to handle Contact routes')
  }
  /*
  // topic routes
  if (topicsController) {
    app.get('/topic', topicsController.all)
    app.post('/topic/:id', topicsController.add)
    app.put('/topic/:id', topicsController.update)
    app.delete('/topic/:id', topicsController.remove)
  } else {
    console.warn('Error: DB unable to handle topics routes')
  }
  */
}
