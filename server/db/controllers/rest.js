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
    this.key = key
    //  TODO: Consider adding a param for populate fields that are autopopulated when mutations are returned.
    console.log(`REST: Instantiated controller: ${model.modelName.toLowerCase()}s, keyed by ${this.key}`)
  }

  // Returns a function that will write the result as a JSON to the response
  ok (res) {
    return (data) => res.json(data)
  }

  /**
  Error handler
  */
  fail (res) {
    return (error) => {
      console.error(error)
      res.sendStatus(error.status || 404).end()
    }
  }

  /*
  QUERY HANDLER:
  Manages population, selects, sorts etc
  Does NOT handle find() related queries
  */
  queryHandler (model, query) {
    // JOIN aka populate, e.g. join=comments,reviews
    if (query.join) {
      //  Split comma-separated string into an array.
      let joins = query.join.split(',')
      let shallowJoins = []
      //  Make a collection of shallow joins. Search for any deep joins
      for (let join of joins) {
        //  If there's a subfield, it's a deep join -  Split and popilate the model's subfields now.
        if (join.includes('.')) {
          const paths = join.split('.')
          model = model.populate({
            path: paths[0],
            populate: { path: paths[1] }
          })
        } else {
          //  Otherwise, add to your list of shallow joins.
          shallowJoins.push(join)
        }
      }
      //  Join all fields w/o deep popilation
      //  Mongoose can do many simple joins with one function call, if separated by spaces.
      if (shallowJoins.length > 0) {
        model = model.populate(shallowJoins.join(' '))
      }
    }
    // SELECT, gathering specific fields e.g. select=name
    if (query.select) model = model.select(query.select.split(',').join(' '))
    return model
  }

  /* *****
    GET (All): List all models
    https://stackoverflow.com/questions/33455507/javascript-conditionally-call-a-function
  ***** */
  getAll (query) {
    //  Get all, unless "where" query, e.g. where={"year":"2017"}
    let model = !query.where
    ? this.model.find({})
    : this.model.find(JSON.parse(query.where))
    model = this.queryHandler(model, query)
    return model.then(modelInstances => modelInstances)
  }

  get (id, query) {
    //  Find by key, unless "where" query, e.g. where={"year":"2017"}
    let model = !query.where
    ? this.model.findOne({ [this.key]: id })
    : this.model.findOne(JSON.parse(query.where))
    model = this.queryHandler(model, query)
    return model.then(modelInstance => modelInstance)
  }

  /* *****
    POST: Add a model
  ***** */
  post (data, query) {
    let model = this.model.create(data)
    //  TODO: Any middleware needed?
    return model.then(modelInstance => modelInstance)
  }

  /* *****
    PATCH: Update a model
    (also known as PUT in other REST api specs)
  ***** */
  patch (id, data, query) {
    let model = this.model.findOne({ [this.key]: id })
    return model
     .then((modelInstance) => {
       for (var attribute in data) {
         if (data.hasOwnProperty(attribute) && attribute !== this.key && attribute !== '_id') {
           modelInstance[attribute] = data[attribute]
         }
       }
       return modelInstance.save()
     })
     .then(modelInstance => modelInstance)
  }
  // patch (id, data, query) {
  //   //  https://codexample.org/questions/306428/mongodb-mongoose-subdocuments-created-twice.c
  //   //  https://github.com/linnovate/mean/issues/511
  //   let model = this.model
  //   return model
  //     .findOneAndUpdate({ [this.key]: id }, data, { upsert: true, setDefaultsOnInsert: true })
  //     .then(modelInstance => modelInstance)
  // }

  /* *****
  DELETE: Remove a model
  ***** */
  delete (id, query) {
    return this.model
      .remove({ [this.key]: id })
      .then(() => {})
  }

  /*
  INIT ROUTES
  Once initialized, you can use() your model directly after construction, e.g.:
  app.use('/v1/blocks', new controllers.Blocks().api())
  */
  api () {
    const router = new Router()
    //  READ
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
    //  CREATE
    router.post('/', (req, res) => {
      this
        .post(req.body, req.query)
        .then(this.ok(res))
        .then(null, this.fail(res))
    })
    //  UPDATE
    router.patch('/:key', (req, res) => {
      this
        .patch(req.params.key, req.body, req.query)  // query?
        .then(this.ok(res))
        .then(null, this.fail(res))
    })
    //  DELETE
    router.delete('/:key', (req, res) => {
      this
        .delete(req.params.key, req.query)
        .then(this.ok(res))
        .then(null, this.fail(res))
    })

    return router
  }
}
