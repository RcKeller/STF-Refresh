import restify from 'express-restify-mongoose'

import { Router } from 'express'
import { Slack } from '../../integrations'

export default class Restify {
  constructor (model) {
    //  Assign model
    this.model = model
    //  express-restify-mongoose configurations - common to all controllers
    this.config = {
      prefix: '',
      version: '/v1',
      name: this.model.modelName.toLowerCase(),
      //  Disabling these allows middleware to be called
      findOneAndUpdate: false,
      findOneAndRemove: false,
      access: (req) => 'private',
      outputFn: (req, res) => {
        const { result, statusCode } = req.erm
        res.status(statusCode).json(result)
      },
      postProcess: (req, res, next) => {
        const { method, path } = req
        const { statusCode } = req.erm
        console.info(`${method} ${path} request completed with status code ${statusCode}`)
        //  TODO: Return population w/ this.children
        next()
      },
      onError: (err, req, res, next) => {
        const { message } = err
        const { statusCode } = req.erm
        console.log(err)
        res.status(statusCode).json({ message })
        next()
      }
    }
    //  Middleware = override this!
    this.middleware = { ...this.config }
    //  Common utils / helpers inherited.
    this.Slack = Slack
  }
  API () {
    const router = new Router()
    restify.serve(router, this.model, this.middleware)
    console.log(`REST: Instantiated controller: ${this.config.name}`)
    return router
  }
}
