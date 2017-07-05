import { Router } from 'express'
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
    this.modelName = model.modelName.toLowerCase()
    this.key = key
    console.log(`REST: Instantiated controller: ${this.modelName} - Key: ${this.key}`)
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
    return (error) => res.sendStatus(404).end() && console.warn(error)
  }

  /* *****
    GET (All): List all models
  ***** */
  getAll (query) {
    return this.model
    .find({})
    .then((modelInstances) => modelInstances)
  }
  get (id, query) {
    let filter = {}
    filter[this.key] = id
    let join = query.join.replace(/,/g, ' ')

    return this.model
      .findOne(filter)
      .populate(join)
      .then((modelInstance) => modelInstance)
  }

  /* *****
    POST: Add a model
  ***** */
  post (data) {
    return this.model
      .create(data)
      .then((modelInstance) => modelInstance)
  }

  /* *****
    DELETE: Remove a model
  ***** */
  delete (id) {
    const filter = {}
    filter[this.key] = id

    return this.model
      .remove(filter)
      .then(() => {})
      // .then(() => {
      //   return {}
      // })
  }

  /* *****
    PUT: Update a model
    (formerly patch. On the fence about changing this).
  ***** */
  put (id, data) {
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
      .then((modelInstance) => modelInstance)
  }

  /*
  INIT ROUTES
  Once initialized, you can use() your model directly after construction, e.g.:
  app.use('/v1/blocks', new controllers.Blocks().route())
  */
  route () {
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

    router.put('/:key', (req, res) => {
      this
        .put(req.params.key, req.body)
        .then(this.ok(res))
        .then(null, this.fail(res))
    })

    //  TODO: Should we add a patch method?

    router.post('/', (req, res) => {
      this
        .post(req.body)
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
