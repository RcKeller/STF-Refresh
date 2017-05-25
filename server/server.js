import serverConfig from './config'
/* *****
DATABASE CONNECTION
Done first, as it takes a long time and is the most likely
point of failure in containers.
***** */
import mongoose from 'mongoose'
import dummyData from './dummyData'
// Set native promises as mongoose promise
console.log('Connecting to MongoDB')
mongoose.Promise = global.Promise
mongoose.connect(serverConfig.mongoURL, (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!') // eslint-disable-line no-console
    throw error
  } else {
    console.log('DB connection successful!')
  }
  // feed some dummy data in DB.
  //  TODO: Disable in production on first release.
  // serverConfig.env != 'production' && dummyData()
  dummyData()
})

/* *****
INITIALIZE SERVER
Requires webpack middlewares in dev mode
***** */
import Express from 'express'
//  Optimizers
import compression from 'compression'
import bodyParser from 'body-parser'
import path from 'path'
// Webpack Requirements and middlewares
import webpack from 'webpack'
import config from '../webpack.config.dev'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

console.log('Initializing Express')
const app = new Express()
// Connect w/ webpack dev server in development mode
if (serverConfig.env === 'development') {
  console.log('Applying Webpack middleware for hot reloading')
  const compiler = webpack(config)
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
  app.use(webpackHotMiddleware(compiler))
}

/* *****
CORE ROUTES
Supplies public assets and parsing middlewares
***** */
import routes from '../client/routes' // Note this! Not the same as API routes.
console.log('Applying public assets and parsing scheme')
app.use(compression())
app.use(bodyParser.json({ limit: '20mb' }))
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }))
app.use(Express.static(path.resolve(__dirname, '../dist')))

/* *****
RESTful API ROUTES
For data store strategies
***** */
//  TODO: Add middleware for API route creation.
console.log('Applying RESTful API routes')
import { PostRouter } from './models/post'
app.use('/api', PostRouter)

/* *****
ISOMORPHIC ROUTING
Generate initial state and core HTML for pages on the server side.
***** */
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import { configureStore } from '../client/flux/store'
import { fetchComponentData } from './util/fetchData'
//  Abstracted out our rendering methods, these create raw HTML pages w/ initial redux state.
import { renderPage, renderError } from './flux/isomorphicRender'
console.log('Applying Isomorphic routing magic')
app.use((req, res, next) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) { return res.status(500).end(renderError(err)) }
    if (redirectLocation) { return res.redirect(302, redirectLocation.pathname + redirectLocation.search) }
    if (!renderProps) { return next() }

    const store = configureStore()
    return fetchComponentData(store, renderProps.components, renderProps.params)
      .then(() => {
        const initialView = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        )
        const finalState = store.getState()
        res
          .set('Content-Type', 'text/html')
          .status(200)
          .end(renderPage(initialView, finalState))
      })
      .catch((error) => next(error))
  })
})

/* *****
INITIALIZE!
***** */
console.log('Revving up the app...')
app.listen(serverConfig.port, (error) => {
  if (!error) {
    console.log('-'.repeat(60))
    console.log('\t== UW APP IS LIVE ==')
    console.log(`\tEnvironment: ${serverConfig.env}`)
    console.log(`\tMongoDB: ${serverConfig.mongoURL}`)
    console.log(`\tBack-End (API): ${serverConfig.api}`)
    console.log(`\tClient exposed on port ${serverConfig.port}`)
    console.log('-'.repeat(60))
  }
})

export default app
