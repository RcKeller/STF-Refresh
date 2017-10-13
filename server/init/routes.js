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
  app.use(new controllers.Configs().API())
  app.use(new controllers.Contacts().API())
  app.use(new controllers.STF().API())
  app.use(new controllers.Comments().API())
  app.use(new controllers.Proposals().API())
  app.use(new controllers.Projects().API())
  app.use(new controllers.Manifests().API())
  app.use(new controllers.Items().API())
  app.use(new controllers.Blocks().API())
  app.use(new controllers.Reviews().API())
  app.use(new controllers.Decisions().API())
  app.use(new controllers.Reports().API())
  console.log(`REST: API live for all ${Object.keys(controllers).length - 1} core models.`)
  //  TODO: Migrate users to the new API endpoint

  // USER PROFILE ROUTES
  console.log('USER: Initializing User REST routes and auth endpoints')
  const Users = new controllers.Users()
  app.use(`/${version}/users`, Users.api())
  app.delete('/sessions', Users.logout)
  console.log(`REST: API live for Users.`)
}
