import express from 'express'
import webpack from 'webpack'
import config from 'config'
import db from './db'
import initPassport from './init/passport'
import initExpress from './init/express'
import initRoutes from './init/routes'
import renderMiddleware from './render/middleware'

const app = express()

/*
 * Database-specific setup
 * - connect to MongoDB using mongoose
 * - register mongoose Schema
 */
db.connect()

// REMOVE if you do not need passport configuration
initPassport()

if (config.has('dev')) {
  // enable webpack hot module replacement
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
initRoutes(app)

/*
 * This is where the magic happens. We take the locals data we have already
 * fetched and seed our stores with data.
 * renderMiddleware matches the URL with react-router and renders the app into
 * HTML
 */
app.get('*', renderMiddleware)
//  Starts a UNIX socket and listens for connections on the given path. This method is identical to Node’s http.Server.listen().
if (config.has('dev')) {
  app.listen(app.get('port'))
} else {
  //  We'll need filesystem tools for certs
  const http = require('http')
  const https = require('https')
  const path = require('path')
  const fs = require('fs')
  console.log('PROD: Configuring dual-servers')
  const key = fs.readFileSync(
    path.resolve(process.cwd(), 'security', 'server-pvk.pem'),
    'utf-8'
  )
  const cert = fs.readFileSync(
    path.resolve(process.cwd(), 'security', 'server-cert.pem'),
    'utf-8'
  )
  //  FIXME: When not using the test port, remove the port here
  const domain = `${config.get('domain')}:${config.get('port')}`

  const httpsServer = https.createServer({ key, cert }, app)
  httpsServer.listen(8090, function () {
    console.log('https listening on ' + httpsServer.address().port)
  })

  //  HTTP redirects users to secure endpoints.
  const httpServer = http.createServer(function (req, res) {
    let redirectURL = `https://${domain}${req.url}`
    res.writeHead(301, {'Location': redirectURL})
    res.end()
    console.log('redirected HTTP connection to ' + redirectURL)
  })
  httpServer.listen(8080, function () {
    console.log('http listening on ' + httpServer.address().port)
  })
}
