import express from 'express'
import session from 'express-session'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import path from 'path'
import flash from 'express-flash'
import methodOverride from 'method-override'
import gzip from 'compression'
import helmet from 'helmet'
import config from 'config'
import db from '../db'
const env = config.get('env')
const port = config.get('port')
const version = config.get('version')

export default (app) => {
  app.set('port', port)

  // Secure your Express apps by setting various HTTP headers. Documentation: https://github.com/helmetjs/helmet
  if (env === 'production') {
    app.use(gzip())
    console.log(`INIT: Enabled compression (GZIP)`)
    app.use(helmet())
    console.log(`INIT: HTTP Headers set via "Helmet"`)
  }
  // LOGGING
  app.use(logger('dev'))

  app.use(bodyParser.json())
  // for parsing application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(methodOverride())
  app.use(cookieParser())

  app.use(express.static(path.join(process.cwd(), 'public')))
  /*
  Indicates the app is behind a front-facing proxy,
  and to use the X-Forwarded-* headers to determine the connection and the IP address of the client.
  NOTE: X-Forwarded-* headers are easily spoofed and the detected IP addresses are unreliable.
  trust proxy is disabled by default.
  When enabled, Express attempts to determine the IP address of the client connected through the front-facing proxy, or series of proxies.
  The req.ips property, then, contains an array of IP addresses the client is connected through.
  To enable it, use the values described in the trust proxy options table.
  The trust proxy setting is implemented using the proxy-addr package. For more information, see its documentation.
  loopback - 127.0.0.1/8, ::1/128
  */
  app.set('trust proxy', 'loopback')
  /*
  Create a session middleware with the given options
  Note session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.

  OPTIONS:
  resave: forces the session to be saved back to the session store, even if the session was never
          modified during the request. Depending on your store this may be necessary, but it can also
          create race conditions where a client has two parallel requests to your server and changes made
          to the session in one request may get overwritten when the other request ends, even if it made no
          changes(this behavior also depends on what store you're using).
 saveUnitialized: Forces a session that is uninitialized to be saved to the store. A session is uninitialized when
          it is new but not modified. Choosing false is useful for implementing login sessions, reducing server storage
          usage, or complying with laws that require permission before setting a cookie. Choosing false will also help with
          race conditions where a client makes multiple parallel requests without a session
 secret: This is the secret used to sign the session ID cookie.
 name: The name of the session ID cookie to set in the response (and read from in the request).
 cookie: Please note that secure: true is a recommended option.
          However, it requires an https-enabled website, i.e., HTTPS is necessary for secure cookies.
          If secure is set, and you access your site over HTTP, the cookie will not be set.
  */
  let sessionStore = null
  db.session
    ? sessionStore = db.session()
    : console.warn('Error: MongoDB failed to handle session storage')

  // const name = config.get('sessionName')
  const secret = config.get('sessionSecret')
  let sess = {
    // name,
    secret,
    store: sessionStore,
    // resave and saveUninitialized: Per legacy UW-STF site, defaults are false
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false
    }
  }
  app.use(session(sess))
  console.log(`SESS: Express sessions / cookies enabled (${config.get('sessionSecret')})`)
  if (env === 'production') sess.cookie.secure = true

  console.log('--------------------------')
  console.log(`<===  Starting ${env} Server . . .`)
  console.log(`<===  Release version: ${version}`)
  console.log(`<===  Listening on port: ${port}`)
  console.log('--------------------------')

  app.use(flash())
}
