import _ from 'lodash'
import Block from '../models/block'

/* *****
  GET (All): List all models
***** */
// export function getAll (req, res) {
//   Block.find({}).exec((err, Blocks) => {
//     if (err) { return res.status(500).send('Server error retrieving all Block documents') }
//     return res.json(Blocks)
//   })
// }

export const getAll = (model) => function getAll (req, res) {
  model.find({}).exec((err, Blocks) => {
    if (err) { return res.status(500).send('Server error retrieving all documents') }
    return res.json(Blocks)
  })
}

export function get (req, res) {
  Block.findById(req.params.id).exec((err, Blocks) => {
    if (err) { return res.status(500).send('Server error retrieving all Block documents') }
    return res.json(Blocks)
  })
}

/* *****
  POST: Add a model
***** */
export function post (req, res) {
  Block.create(req.body, (err) => {
    if (err) { return res.status(400).send(err) }
    return res.status(200).send('OK')
  })
}

/* *****
  PATCH: Update a model
***** */
export function patch (req, res) {
  const query = { id: req.params.id }
  const omitKeys = ['id', '_id', '_v']
  const data = _.omit(req.body, omitKeys)

  Block.findOneAndUpdate(query, data, (err) => {
    if (err) { return res.status(500).send('Server error saving Block') }
    return res.status(200).send('Updated successfully')
  })
}

/* *****
  DELETE: Remove a Block
  (delete is a keyword, substituting w/ "remove")
***** */
export function remove (req, res) {
  const query = { id: req.params.id }
  Block.findOneAndRemove(query, (err) => {
    if (err) { return res.status(500).send('Server error deleting Block') }
    return res.status(200).send('Removed Successfully')
  })
}

export default {
  getAll,
  get,
  post,
  patch,
  remove
}
