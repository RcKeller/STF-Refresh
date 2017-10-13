import restify from 'express-restify-mongoose'

import { Router } from 'express'
import { Slack } from '../../integrations'

export default class Restify {
  constructor () {
    //  express-restify-mongoose configurations - common to all controllers
    this.config = {
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
        const { method, path, erm: { statusCode } } = req.erm
        console.info(`${method} ${path} request completed with status code ${statusCode}`)
      },
      onError: (err, req, res, next) => {
        const { message } = err
        const { statusCode } = req.erm
        console.log(err)
        res.status(statusCode).json({ message })
      }
    }
    //  Common utils / helpers
    this.Router = new Router()
    this.restify = restify
    this.Slack = Slack
  }
}
