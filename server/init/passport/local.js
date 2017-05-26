/*
 Configuring local strategy to authenticate strategies
 Code modified from : https://github.com/madhums/node-express-mongoose-demo/blob/master/config/passport/local.js
 */

import { Strategy as LocalStrategy } from 'passport-local';
import { passport as dbPassport } from '../../db';

export default (passport) => {
  if (!dbPassport || !dbPassport.local || !typeof dbPassport.local === 'function') {
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
  }, dbPassport.local));
};
