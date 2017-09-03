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

  //  NOTE: Moving serialization to individual strategy files
  // if (db.passport && db.passport.deserializeUser) {
  //   passport.serializeUser((user, done) => {
  //     console.warn('init/passport/index serialize', user)
  //     done(null, user.id)
  //   })
  //   passport.deserializeUser(db.passport.deserializeUser)
  // } else {
  //   console.warn('Failed to (de)serialize User')
  // }

  // Load strategies based on the env
  config.has('prod') ? uw(app, passport) : google(app, passport)
}

/*
----SHIB LOGS, pre refactor
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

/*
----GOOGLE LOGS, post refactor
===>  Succeeded in connecting to mongodb://192.168.99.100:27017/uw-dev
db/passport/deserializeUser: 59a482b5910c753d50b76951
ENV development
GET / 304 4134.165 ms - -
webpack built ae46c1abdb253514f8aa in 30592ms
GET /v1/configs/ 304 1553.786 ms - -
GET /v1/comments/?join=proposal 304 1682.618 ms - -
webpack building...
webpack built a5eab2004147c6573127 in 824ms
db/passport/deserializeUser: 59a482b5910c753d50b76951
ENV development
GET / 304 33.470 ms - -
GET /v1/configs/ 304 21.490 ms - -
GET /v1/comments/?join=proposal 304 64.557 ms - -
DELETE /sessions 200 23.947 ms - 2
db/passport/deserializeUser: 59a482b5910c753d50b76951
ENV development
GET / 304 33.292 ms - -
GET /v1/configs/ 304 23.989 ms - -
GET /v1/comments/?join=proposal 304 52.700 ms - -
ENV development
GET / 200 25.071 ms - 11908
GET /v1/configs/ 200 42.398 ms - 429
GET /v1/comments/?join=proposal 200 72.797 ms - 8210
GET /auth/google 302 22.525 ms - 0
Called db/passport/google undefined
init/passport/index serialize { _id: 59a482b5910c753d50b76951,
  stf:
   { _id: 59a482b5910c753d50b76952,
     user: 59a482b5910c753d50b76951,
     spectator: true,
     member: true,
     admin: true,
     __v: 0 },
  netID: 'rykeller',
  email: 'rykeller@uw.edu',
  __v: 0,
  tokens: [],
  name: 'Ryan Keller' }
GET /auth/google/callback?code=4%2FKrb0fRA-ylANCHBLhdG4CPRMPw7bh99nnP29_LWByR0 302 521.645 ms - 46
db/passport/deserializeUser: 59a482b5910c753d50b76951
ENV development
GET / 200 103.366 ms - 12445
GET /v1/configs/ 304 36.387 ms - -
GET /v1/comments/?join=proposal 304 50.374 ms - -

*/
//  NOTE: I see the issue here - shib calls deserialize with an object, Oauth2 just provides an _id
/*
----SHIB LOGS, post refactor
SHIB: Domain and entity: uwstf.org:8090 | https://uwstf.org:8090
SHIB: Login, callback and metadata: /login | /login/callback | /Shibboleth.sso/Metadata
AUTH: Shibboleth Enabled
PROD: Configuring dual-servers
https listening on 8090
http listening on 8080
===>  Succeeded in connecting to mongodb://stf-dev:AlecForChair2017@ds115124.mlab.com:15124/uw-dev
db/passport/deserializeUser: { regId: 'FC97522683434706B95A72148B150508',
  netId: 'rykeller',
  displayName: 'Ryan C Keller',
  surname: 'Keller',
  givenName: 'Ryan Christopher',
  email: 'rykeller@uw.edu' }
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
    at t.default (/home/ubuntu/WEB/STF-Refresh/compiled/server.js:15:118434)
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
GET / 500 103.875 ms - 148

*/

/*
// NOTE: Second take at logging db/passport/google
AUTH: Google "Psuedo-Auth" Enabled
===>  Succeeded in connecting to mongodb://192.168.99.100:27017/uw-dev
webpack built 8b61455abceba556b825 in 30976ms
db/passport/deserializeUser: 59a482b5910c753d50b76951
GET / 304 135.235 ms - -
GET /v1/configs/ 304 91.297 ms - -
GET /v1/comments/?join=proposal 304 107.867 ms - -

DELETE /sessions 200 14.009 ms - 2
GET / 200 21.516 ms - 11908
GET /v1/configs/ 200 56.220 ms - 429
GET /v1/comments/?join=proposal 200 66.936 ms - 8210
GET /auth/google 302 34.472 ms - 0
Called db/passport/google undefined ya29.Glu7BGGJG7phQOXW6iN-58Ok1RnH_Q4XZivVFnJ8x_cNYFbMWrqugKMC5OY_hGCDKraxZ6duGA2kD8aWVX4TD39inmtEZNZDJ-zZ7XZ53F_gr9l662_qE3nK-
RxB undefined { id: '114331283165806421155',
  displayName: 'Ryan Keller',
  name: { familyName: 'Keller', givenName: 'Ryan' },
  emails: [ { value: 'rykeller@uw.edu', type: 'account' } ],
  photos: [ { value: 'https://lh6.googleusercontent.com/-XipGZnBWaho/AAAAAAAAAAI/AAAAAAAAC00/wq968fUmwE4/photo.jpg?sz=50' } ],
  gender: undefined,
  provider: 'google',
  _raw: '{\n "kind": "plus#person",\n "etag": "\\"Sh4n9u6EtD24TM0RmWv7jTXojqc/g22Cw9ftwVF5vulhO6WYabDmruE\\"",\n "emails": [\n  {\n   "value": "rykeller@uw.edu",\
n   "type": "account"\n  }\n ],\n "objectType": "person",\n "id": "114331283165806421155",\n "displayName": "Ryan Keller",\n "name": {\n  "familyName": "Keller",\
n  "givenName": "Ryan"\n },\n "image": {\n  "url": "https://lh6.googleusercontent.com/-XipGZnBWaho/AAAAAAAAAAI/AAAAAAAAC00/wq968fUmwE4/photo.jpg?sz=50",\n  "isDef
ault": false\n },\n "isPlusUser": false,\n "language": "en",\n "verified": false,\n "domain": "uw.edu"\n}\n',
  _json:
   { kind: 'plus#person',
     etag: '"Sh4n9u6EtD24TM0RmWv7jTXojqc/g22Cw9ftwVF5vulhO6WYabDmruE"',
     emails: [ [Object] ],
     objectType: 'person',
     id: '114331283165806421155',
     displayName: 'Ryan Keller',
     name: { familyName: 'Keller', givenName: 'Ryan' },
     image:
      { url: 'https://lh6.googleusercontent.com/-XipGZnBWaho/AAAAAAAAAAI/AAAAAAAAC00/wq968fUmwE4/photo.jpg?sz=50',
        isDefault: false },
     isPlusUser: false,
     language: 'en',
     verified: false,
     domain: 'uw.edu' } }
init/passport/index serialize { _id: 59a482b5910c753d50b76951,
  stf:
   { _id: 59a482b5910c753d50b76952,
     user: 59a482b5910c753d50b76951,
     spectator: true,
     member: true,
     admin: true,
     __v: 0 },
  netID: 'rykeller',
  email: 'rykeller@uw.edu',
  __v: 0,
  tokens: [],
  name: 'Ryan Keller' }
GET /auth/google/callback?code=4%2FEJ1Ehc9FeVSFWmW6LDo5BpmH06mpCaTrI1ejaZGmrCk 302 522.087 ms - 46
db/passport/deserializeUser: 59a482b5910c753d50b76951
GET / 200 81.400 ms - 12445
GET /v1/configs/ 304 30.069 ms - -
GET /v1/comments/?join=proposal 304 54.544 ms - -

*/
