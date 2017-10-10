import REST from './rest'
// import { Manifest, Item, Proposal } from '../models'
import Models from '../models'
import mongoose from 'mongoose'
import _ from 'lodash'

import { Slack } from '../../integrations'

const capitalize = (str) => str.charAt(0).toUpperCase().concat(str.slice(1).toLowerCase())

export default class Manifests extends REST {
  constructor () {
    super(Models.Manifest, '_id')
    /*
    Relations describe the association between subdocuments, their schema, and subscheme refs to parents
    */
    this.relations = {
      proposal: {
        model: Models.Proposal,
        ref: 'manifests',
        type: 'array'
      },
      report: {
        model: Models.Report,
        ref: 'manifest',
        type: 'object'
      },
      author: {
        model: Models.User
      },
      items: {
        model: Models.Item,
        ref: 'manifest',
        type: 'object'
      },
      reviews: {
        model: Models.Review,
        ref: 'manifest',
        type: 'array'
      },
      decision: {
        model: Models.Decision,
        ref: 'manifest',
        type: 'object'
      }
    }
    this.children = Object.keys(this.relations)
    this.populate = this.children.join(' ')
  }
  /* *****
    POST: Add a model
    Modified to insertMany(<items>)
  ***** */
  post (data, query) {
    //  Omit subdocs, create the parent, then patch it in order to create items
    let { items } = data
    let manifest = _.omit(data, ['_v', 'items'])
    //  NOTE: Should I assign a model var and return model.patch?
    return this.model
      .create(manifest)
      .then(model => {
        switch (model.type) {
          case 'supplemental':
            Models.Proposal
              .findById(model.proposal)
              .then(proposal => Slack.announceSupplemental(model, proposal))
              .catch(err => console.warn(err))
            break
          case 'partial':
            Models.Proposal
              .findById(model.proposal)
              .then(proposal => Slack.announcePartial(model, proposal))
              .catch(err => console.warn(err))
            break
        }
        return this.patch(model._id, { items }, query)
      })
  }

  /* *****
    PATCH: Update a model
    (also known as PUT in other REST api specs)
    Modified to insertMany(<items>)
  ***** */
  //  https://stackoverflow.com/questions/26156687/mongoose-find-update-subdocument
  //  http://www.jonahnisenson.com/tips-on-working-with-embedded-arrays-in-mongoosemongo/
  patch (id, data, query) {
    let update = {}
    // Object.keys(data).forEach(key => {
    //   this.children.includes(key)
    //     ? update['$set'] = { '$push': { [key]: data[key] } }
    //     : update[key] = data[key]
    // })
    //  https://docs.mongodb.com/manual/reference/operator/update/positional/#update-documents-in-an-array
    //  https://stackoverflow.com/questions/43128561/mongoose-findoneandupdate-updating-an-object-inside-an-array-of-objects
    // Object.keys(data).forEach(key => {
    //   this.children.includes(key)
    //     ? update[`${key}.$`] = data[key]
    //     : update[key] = data[key]
    // })
    const mongoOptions = { upsert: true, setDefaultsOnInsert: true, new: true }
    //  http://www.ccalvert.net/books/CloudNotes/Assignments/MongooseSubdocuments.html
    // return this.model
    //   .findOneAndUpdate({ [this.key]: id }, update, mongoOptions)
    //   .populate(this.populate)
    //   .then((modelInstance) => modelInstance)
    return this.model
    //  http://mongoosejs.com/docs/2.7.x/docs/embedded-documents.html
      .findOne({ [this.key]: id })
      .then(modelInstance => {
        console.log(modelInstance, Object.keys(modelInstance))
        //  https://stackoverflow.com/questions/7035092/how-to-update-embedded-document-in-mongoose
        //  Iterate over props, and if they are child refs...
        for (let prop in data) {
          if (data.hasOwnProperty(prop) && prop !== this.key && prop !== '_id') {
            if (this.children.includes(prop)) {
              console.log('CHILD ATTR', prop)
              if (Array.isArray(data[prop])) {
                console.log('IS ARRAY')
                const { model: propModel, ref, type } = this.relations[prop]
                for (let e of data[prop]) {
                  propModel.findOneAndUpdate({ _id: e._id }, e, mongoOptions).exec()
                }
              } else {
                console.log('not array')
                const { model: propModel, ref, type } = this.relations[prop]
                propModel.findOneAndUpdate({ _id: e._id }, e, mongoOptions).exec()
              }
              // modelInstance.markModified(prop)
            }
          } else {
            modelInstance[prop] = data[prop]
          }
        }
        return modelInstance.save()
      })
      .then((modelInstance) => {
        return this.model
          .findById(id)
          .populate(this.populate)
          .then(modelInstance => modelInstance)
        // console.warn('INSTANCE:', modelInstance)
        // return modelInstance
      })
  }
}
