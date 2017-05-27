/*
 Configuring local strategy to authenticate strategies
 Code modified from : https://github.com/madhums/node-express-mongoose-demo/blob/master/config/passport/local.js
 */

import { Strategy as LocalStrategy } from 'passport-local';
import db from '../../db';

export default (passport) => {
  if (!db.passport || !db.passport.local || !typeof db.passport.local === 'function') {
    console.warn('Error: Mongo failed to initialize passport-local strategy');
    return;
  }

  /*
  By default, LocalStrategy expects to find credentials in parameters named username and password.
  If your site prefers to name these fields differently,
  options are available to change the defaults.
  */
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, db.passport.local));
};
