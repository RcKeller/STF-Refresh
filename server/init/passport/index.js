/* Initializing passport.js */
import passport from 'passport'
import config from 'config'
import db from '../../db'
import google from './google'
import uw from './uw'

export default (app) => {
  /*
  Configure Passport authenticated session persistence.

  In order to restore authentication state across HTTP requests, Passport needs
  to serialize users into and deserialize users out of the session.  The
  typical implementation of this is as simple as supplying the user ID when
  serializing, and querying the user record by ID from the database when
  deserializing.
  */
  app.use(passport.initialize())
  app.use(passport.session())

  if (db.passport && db.passport.deserializeUser) {
    passport.serializeUser((user, done) => {
      console.warn('init/passport/index serialize', user)
      done(null, user.id)
    })
    passport.deserializeUser(db.passport.deserializeUser)
  } else {
    console.warn('Failed to (de)serialize User')
  }

  // Load strategies based on the env
  config.has('prod') ? uw(app, passport) : google(app, passport)
}

/*
Serialize user: { regId: 'FC97522683434706B95A72148B150508',
  netId: 'rykeller',
  displayName: 'Ryan C Keller',
  surname: 'Keller',
  givenName: 'Ryan Christopher',
  email: 'rykeller@uw.edu' }
POST /login/callback 302 194.673 ms - 62
CastError: Cast to ObjectId failed for value "{ regId: 'FC97522683434706B95A72148B150508',
  netId: 'rykeller',
  displayName: 'Ryan C Keller',
  surname: 'Keller',
  givenName: 'Ryan Christopher',
  email: 'rykeller@uw.edu' }" at path "_id" for model "User"
    at MongooseError.CastError (/home/ubuntu/WEB/STF-Refresh/node_modules/mongoose/lib/error/cast.js:26:11)
    at ObjectId.cast (/home/ubuntu/WEB/STF-Refresh/node_modules/mongoose/lib/schema/objectid.js:147:13)
    at ObjectId.castForQuery (/home/ubuntu/WEB/STF-Refresh/node_modules/mongoose/lib/schema/objectid.js:187:15)
    at cast (/home/ubuntu/WEB/STF-Refresh/node_modules/mongoose/lib/cast.js:192:34)
    at Query.cast (/home/ubuntu/WEB/STF-Refresh/node_modules/mongoose/lib/query.js:2915:12)
    at Query.findOne (/home/ubuntu/WEB/STF-Refresh/node_modules/mongoose/lib/query.js:1395:10)
    at Function.findOne (/home/ubuntu/WEB/STF-Refresh/node_modules/mongoose/lib/model.js:1366:13)
    at Function.findById (/home/ubuntu/WEB/STF-Refresh/node_modules/mongoose/lib/model.js:1294:15)
    at t.default (/home/ubuntu/WEB/STF-Refresh/compiled/server.js:15:118341)
    at pass (/home/ubuntu/WEB/STF-Refresh/node_modules/passport/lib/authenticator.js:347:9)
    at Authenticator.deserializeUser (/home/ubuntu/WEB/STF-Refresh/node_modules/passport/lib/authenticator.js:352:5)
    at SessionStrategy.authenticate (/home/ubuntu/WEB/STF-Refresh/node_modules/passport/lib/strategies/session.js:53:28)
    at attempt (/home/ubuntu/WEB/STF-Refresh/node_modules/passport/lib/middleware/authenticate.js:348:16)
    at authenticate (/home/ubuntu/WEB/STF-Refresh/node_modules/passport/lib/middleware/authenticate.js:349:7)
    at Layer.handle [as handle_request] (/home/ubuntu/WEB/STF-Refresh/node_modules/express/lib/router/layer.js:95:5)
    at trim_prefix (/home/ubuntu/WEB/STF-Refresh/node_modules/express/lib/router/index.js:317:13)
    at /home/ubuntu/WEB/STF-Refresh/node_modules/express/lib/router/index.js:284:7
    at Function.process_params (/home/ubuntu/WEB/STF-Refresh/node_modules/express/lib/router/index.js:335:12)
    at next (/home/ubuntu/WEB/STF-Refresh/node_modules/express/lib/router/index.js:275:10)
    at initialize (/home/ubuntu/WEB/STF-Refresh/node_modules/passport/lib/middleware/initialize.js:53:5)
    at Layer.handle [as handle_request] (/home/ubuntu/WEB/STF-Refresh/node_modules/express/lib/router/layer.js:95:5)
    at trim_prefix (/home/ubuntu/WEB/STF-Refresh/node_modules/express/lib/router/index.js:317:13)
*/
