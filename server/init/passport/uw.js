// import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
// import shib from 'passport-uwshib';
// var shib = require('passport-uwshib');
// import * as shib from 'passport-uwshib'
// import shib = require('passport-uwshib'); // it really only works if import = notation is used

import db from '../../db';
import config from 'config';

export default (passport) => {
  try {
    const shib = require('passport-uwshib').default;

    const domain = `${config.get('domain')}:${config.get('port')}`
    const url = `${config.get('protocol')}://${domain}`
    
    passport.use(
      new shib.Strategy({
        entityId: url,
        privateKey: config.get('key'),
        callbackURL: config.get('uw.callbackURL'),
        domain
      })
    );
  } catch (err) {
    console.warn(`ERROR: UW Shib strategy failed to initialize. Auth WILL be broken.\n${err}`)
  }
};
