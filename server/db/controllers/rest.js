import { Router } from 'express'
import config from 'config'
const env = config.get('env')

/*
CORE RESTful CONTROLLER:
Every model adheres to this interface as a baseline.
After extending, each controller may have certain overrides
(saving subdocuments, server-side business logic, etc)

http://rvcode.com/javascript/2016/01/02/generic-crud-controller-with-mongoose-and-express.html
*/
export default class REST {
  /**
    @param model Mongoose model
    @param key primary key of the model that will be used for searching, removing
    and geting. This does NOT have to always be _id
  */
  constructor (model, key) {
    this.model = model
    this.key = key
    console.log(`REST: Instantiated controller: ${model.modelName.toLowerCase()}s, keyed by ${this.key}`)
  }

  // Returns a function that will write the result as a JSON to the response
  ok (res) {
    return (data) => res.json(data)
  }

  /**
  Depending on the error type, will perform the following:

  Object was not found - 404 Not Found
  Invalid or missing input parameter - 400 Bad request
  Not enough privileges - 401 Unauthorized
  Unknown error - 500 Internal server error
  */
  fail (res) {
    return (error) => res.sendStatus(error.status || 404).end()
  }

  /* *****
    GET (All): List all models
  ***** */
  getAll (query) {
    //  QUERY CASE: join (populate in mongo)
    if (query.join) {
      console.log(query.join.split(',').join(' '))
      return this.model
        .find({})
        .populate(query.join.split(',').join(' '))
        .then((modelInstances) => modelInstances)
    }
    return this.model
      .find({})
      .then((modelInstances) => modelInstances)
  }
  get (id, query) {
    let filter = {}
    filter[this.key] = id
    // let join = query.join.replace(/,/g, ' ')

    return this.model
      .findOne(filter)
      // .populate(join)
      .then((modelInstance) => modelInstance)
  }

  /* *****
    POST: Add a model
  ***** */
  post (data, query) {
    return this.model
      .create(data)
      .then((modelInstance) => modelInstance)
  }

  /* *****
    PUT: Update a model
    (formerly patch. On the fence about changing this).
  ***** */
  put (id, data, query) {
    const filter = { [this.key]: id }

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
      .then((modelInstance) => modelInstance)
  }

  /* *****
  DELETE: Remove a model
  ***** */
  delete (id, query) {
    const filter = { [this.key]: id }
    return this.model
    .remove(filter)
    .then(() => {})
  }

  /*
  INIT ROUTES
  Once initialized, you can use() your model directly after construction, e.g.:
  app.use('/v1/blocks', new controllers.Blocks().route())
  */
  api () {
    const router = new Router()

    router.get('/', (req, res) => {
      this
        .getAll(req.query)
        .then(this.ok(res))
        .then(null, this.fail(res))
    })

    router.get('/:key', (req, res) => {
      this
        .get(req.params.key, req.query)
        .then(this.ok(res))
        .then(null, this.fail(res))
    })

    router.post('/', (req, res) => {
      this
        .post(req.body, req.query)
        .then(this.ok(res))
        .then(null, this.fail(res))
    })

    router.put('/:key', (req, res) => {
      this
      .put(req.params.key, req.body, req.query)
      .then(this.ok(res))
      .then(null, this.fail(res))
    })

    //  TODO: Should we add a patch method?

    router.delete('/:key', (req, res) => {
      this
        .delete(req.params.key, req.query)
        .then(this.ok(res))
        .then(null, this.fail(res))
    })

    return router
  }
}
