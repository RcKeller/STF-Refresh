import { Router } from 'express'
import pluralize from 'pluralize'
/*
Generic CRUD controller
http://rvcode.com/javascript/2016/01/02/generic-crud-controller-with-mongoose-and-express.html
*/

/**
  Generic controller that provides CRUD operations for a given Mongoose model
*/
export default class REST {
  /**
    @param model Mongoose model
    @param key primary key of the model that will be used for searching, removing
    and reading
  */
  constructor (model, key) {
    this.model = model
    this.modelName = model.modelName.toLowerCase()
    this.key = key
  }

  /**
  Returns a function that will write the result as a JSON to the response
  */
  ok (res) {
    return (data) => { res.json(data) }
  }

  /**
  Depending on the error type, will perform the following:

  Object was not found - 404 Not Found
  Invalid or missing input parameter - 400 Bad request
  Not enough privileges - 401 Unauthorized
  Unknown error - 500 Internal server error
  */
  fail (res) {
    return (error) => {
      console.log(error)
      res.sendStatus(404).end()
    }
  }

  create (data) {
    return this.model
      .create(data)
      .then((modelInstance) => {
        var response = {}
        response[this.modelName] = modelInstance
        return response
      })
  }

  read (id) {
    var filter = {}
    filter[this.key] = id

    return this.model
    .findOne(filter)
    .then((modelInstance) => {
      var response = {}
      response[this.modelName] = modelInstance
      return response
    })
  }

  list () {
    return this.model
      .find({})
      .then((modelInstances) => {
        var response = {}
        response[pluralize(this.modelName)] = modelInstances
        return response
      })
  }

  delete (id) {
    const filter = {}
    filter[this.key] = id

    return this.model
      .remove(filter)
      .then(() => {
        return {}
      })
  }

  /**
   */
  update (id, data) {
    var filter = {}
    filter[this.key] = id

    return this.model
      .findOne(filter)
      .then((modelInstance) => {
        for (var attribute in data) {
          if (data.hasOwnProperty(attribute) && attribute !== this.key && attribute !== '_id') {
            modelInstance[attribute] = data[attribute]
          }
        }

        return modelInstance.save()
      })
      .then((modelInstance) => {
        var response = {}
        response[this.modelName] = modelInstance
        return response
      })
  }

  route () {
    const router = new Router()

    router.get('/', (req, res) => {
      this
        .list()
        .then(this.ok(res))
        .then(null, this.fail(res))
    })

    router.get('/:key', (req, res) => {
      this
      .read(req.params.key)
      .then(this.ok(res))
      .then(null, this.fail(res))
    })

    router.put('/:key', (req, res) => {
      this
      .update(req.params.key, req.body)
      .then(this.ok(res))
      .then(null, this.fail(res))
    })

    router.post('/', (req, res) => {
      this
        .create(req.body)
        .then(this.ok(res))
        .then(null, this.fail(res))
    })

    router.delete('/:key', (req, res) => {
      this
        .delete(req.params.key)
        .then(this.ok(res))
        .then(null, this.fail(res))
    })

    return router
  }
}
