import express from 'express'
import webpack from 'webpack'
import config from 'config'
import db from './db'
import initPassport from './init/passport'
import initExpress from './init/express'
import initRoutes from './init/routes'
import renderMiddleware from './render/middleware'
const env = config.get('env')
const port = config.get('port')

const app = express()

/*
 * Database-specific setup
 * - connect to MongoDB using mongoose
 * - register mongoose Schema
 */
db.connect()

if (env === 'development') {
  // enable webpack hot module replacement
  console.log('DEV: Loading Webpack HRM middleware and compilers')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpackConfig = require('../webpack/webpack.config')
  const devBrowserConfig = webpackConfig({ browser: true })
  const compiler = webpack(devBrowserConfig)
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: devBrowserConfig.output.publicPath }))
  app.use(webpackHotMiddleware(compiler))
}

//  Bootstrap application settings
initExpress(app)
//  Initialize API routes
initRoutes(app)
//  Initialize authZ systems and associated routes
initPassport(app)

/*
 * This is where the magic happens. We take the locals data we have already
 * fetched and seed our stores with data.
 * renderMiddleware matches the URL with react-router and renders the app into
 * HTML
 */
app.get('*', renderMiddleware)
//  Starts a UNIX socket and listens for connections on the given path. This method is identical to Node’s http.Server.listen().
if (env === 'development') {
  console.log('DEV: Starting hot-reloading webpack server')
  app.listen(app.get('port'))
} else {
  //  NOTE: Using require() syntax for cert loading and filesystem ops, improves dev server build times.
  const http = require('http')
  const https = require('https')
  const path = require('path')
  const fs = require('fs')
  const redirect = config.get('redirect')

  console.log(`PROD: Configuring dual-servers (HTTP redirects ${redirect} to secure port ${port})`)
  const key = fs.readFileSync(
    path.resolve(process.cwd(), 'security', 'server-pvk.pem'),
    'utf-8'
  )
  const cert = fs.readFileSync(
    path.resolve(process.cwd(), 'security', 'server-cert.pem'),
    'utf-8'
  )

  const domain = `${config.get('domain')}:${config.get('port')}`

  const httpsServer = https.createServer({ key, cert }, app)
  httpsServer.listen(port, function () {
    console.log('https listening on ' + httpsServer.address().port)
  })

  //  HTTP redirects users to secure endpoints.
  //  This is a best practice, also necessary for uw-shib
  const httpServer = http.createServer(function (req, res) {
    let redirectURL = `https://${domain}${req.url}`
    res.writeHead(301, {'Location': redirectURL})
    res.end()
    console.log('redirected HTTP connection to ' + redirectURL)
  })
  httpServer.listen(redirect, function () {
    console.log('http listening on ' + httpServer.address().port)
  })
}
