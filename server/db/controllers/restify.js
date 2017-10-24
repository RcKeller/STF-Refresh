import restify from 'express-restify-mongoose'
import _ from 'lodash'

import { Router } from 'express'
import { Log, Slack } from '../../integrations'

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
      // findOneAndUpdate: false,
      // findOneAndRemove: false,
      access: (req) => 'private',
      outputFn: (req, res) => {
        const { statusCode, result } = req.erm
        res.status(statusCode).json(result)
      },
      //  postProcess will shoot errors, writes on res after response is in flight.
      //  This appears stable, but time will tell.
      postProcess: function (req, res, next) {
        const { method, path, erm } = req
        if (method !== 'GET' && erm) {
          try {
            //  FIXME: SSR can't grab client cookies, so we jack session info on the server side
            const user = _.get(req, 'session.passport.user.netID', 'Anonymous')
            const { statusCode, result } = erm
            Log.verbose(`${user} - ${method} - ${path} - ${statusCode} \n ${JSON.stringify(result)}`)
          } catch (err) {
            console.error('Failed to log user action', err)
          }
          // next()
        }
      },
      onError: (err, req, res, next) => {
        const { message } = err
        const { statusCode } = req.erm
        console.error(`ERM:  ${err}`)
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
