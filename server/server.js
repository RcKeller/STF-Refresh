import Express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import path from 'path'

// Webpack Requirements
import webpack from 'webpack'
import config from '../webpack.config.dev'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

// MongoDB Connection
import mongoose from 'mongoose'
import dummyData from './dummyData'
// Set native promises as mongoose promise
mongoose.Promise = global.Promise
mongoose.connect(serverConfig.mongoURL, (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!') // eslint-disable-line no-console
    throw error
  }
  // feed some dummy data in DB.
  //  TODO: Disable in production on first release.
  // serverConfig.env != 'production' && dummyData()
  dummyData()
})

// Initialize the Express App
import serverConfig from './config'
const app = new Express()
// Connect w/ webpack dev server in development mode
if (serverConfig.env === 'development') {
  const compiler = webpack(config)
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
  app.use(webpackHotMiddleware(compiler))
}


// Import required modules and routes
import routes from '../client/routes'
import { fetchComponentData } from './util/fetchData'
// Apply body Parser and server public assets and routes
app.use(compression())
app.use(bodyParser.json({ limit: '20mb' }))
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }))
app.use(Express.static(path.resolve(__dirname, '../dist')))

// Server side API routes
//  TODO: Add middleware for API route creation.
import { PostRouter } from './models/post'
app.use('/api', PostRouter)


// Server Side Rendering based on routes matched by React-router.
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import { configureStore } from '../client/flux/store'

import { renderPage, renderError } from './flux/isomorphicRender'

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

// start app
app.listen(serverConfig.port, (error) => {
  if (!error) {
    console.log('-'.repeat(60))
    console.log('\t== UW STF APP IS LIVE ==')
    console.log(`\tEnvironment: ${serverConfig.env}`)
    console.log(`\tMongoDB: ${serverConfig.mongoURL}`)
    console.log(`\tBack-End (API): ${serverConfig.api}`)
    console.log(`\tClient exposed on port ${serverConfig.port}`)
    console.log('-'.repeat(60))
  }
})

export default app
