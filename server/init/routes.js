// import passport from 'passport'
import config from 'config'
import db from '../db'
const version = config.get('version')
const controllers = db.controllers

import { Item } from '../db/models'
import express from 'express'
import restify from 'express-restify-mongoose'

//  GENERATE ROUTES
export default (app) => {
  console.log('REST: Initializing rest API routes')
  /*
  RESTful API
  */
  app.use(`/${version}/configs`, new controllers.Configs().api())
  app.use(`/${version}/contacts`, new controllers.Contacts().api())
  app.use(`/${version}/stf`, new controllers.STF().api())
  app.use(`/${version}/comments`, new controllers.Comments().api())
  app.use(`/${version}/proposals`, new controllers.Proposals().api())
  app.use(`/${version}/projects`, new controllers.Projects().api())
  app.use(`/${version}/manifests`, new controllers.Manifests().api())
  // app.use(`/${version}/items`, new controllers.Items().api())
  app.use(`/${version}/blocks`, new controllers.Blocks().api())
  app.use(`/${version}/reviews`, new controllers.Reviews().api())
  app.use(`/${version}/decisions`, new controllers.Decisions().api())
  app.use(`/${version}/reports`, new controllers.Reports().api())
  console.log(`REST: API live for all ${Object.keys(controllers).length - 1} core models.`)

  const router = express.Router()
  const options = {
    prefix: '',
    version: '/v1',
    //  Disabling these allows middleware to be called
    findOneAndUpdate: false,
    findOneAndRemove: false,
    access: (req) => 'private',
    outputFn: (req, res) => {
      const result = req.erm.result         // filtered object
      const statusCode = req.erm.statusCode // 200 or 201
      res.status(statusCode).json(result)
    },
    postProcess: (req, res, next) => {
      // const result = req.erm.result         // filtered object
      const statusCode = req.erm.statusCode // 200 or 201
      const model = req.erm.model
      console.info(`${req.method} ${req.path} request completed with status code ${statusCode}`)
      console.warn('ERM keys:', typeof req.erm, Object.keys(req.erm), Object.keys(model))
      console.warn('MODEL:', Object.keys(model.model))
      console.warn('SCHEMA:', Object.keys(model.schema))
      console.warn('BASE:', Object.keys(model.base))
      console.warn('COLLECTION:', Object.keys(model.collection))
      console.warn('DB:', Object.keys(model.db))
    },
    onError: (err, req, res, next) => {
      const statusCode = req.erm.statusCode // 400 or 404
      res.status(statusCode).json({ message: err.message })
    }

  }
  restify.serve(router, Item, options)
  app.use(router)

  // USER PROFILE ROUTES
  console.log('USER: Initializing User REST routes and auth endpoints')
  const Users = new controllers.Users()
  app.use(`/${version}/users`, Users.api())
  app.delete('/sessions', Users.logout)
  console.log(`REST: API live for Users.`)
}
