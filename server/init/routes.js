/**
 * Routes for express app
 */
import passport from 'passport';
import db from '../db';
import config from 'config'

const usersController = db.controllers && db.controllers.users;
const topicsController = db.controllers && db.controllers.topics;

export default (app) => {
  // user routes
  if (usersController) {
    app.post('/sessions', usersController.login);
    app.post('/users', usersController.signUp);
    app.delete('/sessions', usersController.logout);
  } else {
    console.warn('Error: DB unable to handle user routes.');
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
    }));

    // Google will redirect the user to this URL after authentication. Finish the
    // process by verifying the assertion. If valid, the user will be logged in.
    // Otherwise, the authentication has failed.
    app.get(config.get('google.callbackURL'),
      passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
      })
    );
  }
  if (db.passport && config.has('uw')) {
    console.log('UW Shib specified in config, but routes/API not ready yet.')
    app.get(config.get('uw.callbackURL'),
      console.log('Error - UW Shib not connected yet! In development.')
    );
  }

  // topic routes
  if (topicsController) {
    app.get('/topic', topicsController.all);
    app.post('/topic/:id', topicsController.add);
    app.put('/topic/:id', topicsController.update);
    app.delete('/topic/:id', topicsController.remove);
  } else {
    console.warn('Error: DB unable to handle topics routes');
  }
};
