// import passport from 'passport'
import config from 'config'
import db from '../db'
const version = config.get('version')
const controllers = db.controllers

import express from 'express'
import restify from 'express-restify-mongoose'
import mongoose from 'mongoose'
import { Manifest, Item } from '../db/models'

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
  // app.use(`/${version}/manifests`, new controllers.Manifests().api())
  // app.use(`/${version}/items`, new controllers.Items().api())
  app.use(`/${version}/blocks`, new controllers.Blocks().api())
  app.use(`/${version}/reviews`, new controllers.Reviews().api())
  app.use(`/${version}/decisions`, new controllers.Decisions().api())
  // app.use(`/${version}/reports`, new controllers.Reports().api())
  console.log(`REST: API live for all ${Object.keys(controllers).length - 1} core models.`)

  const router = express.Router()
  const config = {
    prefix: '',
    version: '/v1',
    //  Disabling these allows middleware to be called
    findOneAndUpdate: false,
    findOneAndRemove: false,
    access: (req) => 'private',
    outputFn: (req, res) => {
      const result = req.erm.result
      const statusCode = req.erm.statusCode
      res.status(statusCode).json(result)
    },
    postProcess: (req, res, next) => {
      const statusCode = req.erm.statusCode
      console.info(`${req.method} ${req.path} request completed with status code ${statusCode}`)
    },
    onError: (err, req, res, next) => {
      const statusCode = req.erm.statusCode // 400 or 404
      console.log(err)
      res.status(statusCode).json({ message: err.message })
    }
  }
  restify.serve(router, Item, config)
  app.use(new controllers.Manifests().API())
  app.use(new controllers.Reports().API())
  app.use(router)
  // restify.serve(router, Manifest, Object.assign(options, manifestMiddleware))
  // restify.serve(router, Manifest, options)

  // USER PROFILE ROUTES
  console.log('USER: Initializing User REST routes and auth endpoints')
  const Users = new controllers.Users()
  app.use(`/${version}/users`, Users.api())
  app.delete('/sessions', Users.logout)
  console.log(`REST: API live for Users.`)
}
