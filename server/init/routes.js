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
      const { result, statusCode } = req.erm
      res.status(statusCode).json(result)
    },
    postProcess: (req, res, next) => {
      const { statusCode } = req.erm
      // const model = req.erm.model
      console.info(`${req.method} ${req.path} request completed with status code ${statusCode}`)
      console.warn('ERM keys:', typeof req.erm, Object.keys(req.erm))
      // console.warn('MODEL:', Object.keys(model.model))
      // console.warn('SCHEMA:', Object.keys(model.schema))
      // console.warn('BASE:', Object.keys(model.base))
      // console.warn('COLLECTION:', Object.keys(model.collection))
      // console.warn('DB:', Object.keys(model.db))
    },
    onError: (err, req, res, next) => {
      const { statusCode } = req.erm
      console.log(err)
      res.status(statusCode).json({ message: err.message })
    }

  }
  const createOrUpdate = { upsert: true, setDefaultsOnInsert: true, new: true }
  /*
  Upserts items, then returns an array of their IDs
    NOTE: Saving items will overwrite whatever exists.
    This is for security, and left because we do not have a use case where sub items need to be merged.
    Implication - patching a manifest writes new items.
    //  BUG: https://github.com/florianholzapfel/express-restify-mongoose/issues/276
  */
  async function saveItems (items = [], manifest) {
    for (let [i, item] of items.entries()) {
      if (!item.manifest && manifest) item.manifest = manifest
      if (!item._id) item._id = mongoose.Types.ObjectId()
      let ref = await Item
        .findByIdAndUpdate(item._id, item, createOrUpdate, (err, doc) => !err ? doc._id : '')
      if (ref) items[i] = ref
    }
    return items
  }
  async function getTotal (items = []) {
    let total = 0
    for (let item of items) {
      if (item.quantity > 0) {
        item.tax
          ? total += (item.price * item.quantity * (1 + item.tax / 100))
          : total += (item.price * item.quantity)
      }
    }
    return total
  }
  async function wait (ms) {
    await new Promise(resolve => setTimeout(() => resolve(), ms))
    console.log('waited', ms)
    return ms
  }
  const manifestMiddleware = {
    preMiddleware: function (req, res, next) {
      let { body } = req
      Promise.all([
        saveItems(body.items, body._id)
          .then(items => body.items = items),
        getTotal(body.items)
          .then(total => body.total = total),
        wait(200),
        wait(400)
      ]).then(() => next())
      // saveItems(body.items, body._id).then(items => {
      //   body.items = items
      //   next()
      // })
    }
  }

/*
async function test() {
    for (let i = 0; i < 2; i++) {
        console.log('Before await for ', i);
        let result = await Promise.resolve(i);
        console.log('After await. Value is ', result);
    }
}

test().then(_ => console.log('After test() resolved'));

console.log('After calling test');
*/

  restify.serve(router, Item, options)
  restify.serve(router, Manifest, Object.assign(options, manifestMiddleware))
  // restify.serve(router, Manifest, options)
  app.use(router)

  // USER PROFILE ROUTES
  console.log('USER: Initializing User REST routes and auth endpoints')
  const Users = new controllers.Users()
  app.use(`/${version}/users`, Users.api())
  app.delete('/sessions', Users.logout)
  console.log(`REST: API live for Users.`)
}
