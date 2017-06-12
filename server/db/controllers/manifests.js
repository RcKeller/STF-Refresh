import _ from 'lodash'
import Manifest from '../models/manifest'

/* *****
  List
***** */
export function all (req, res) {
  Manifest.find({}).exec((err, Manifests) => {
    if (err) { return res.status(500).send('Server error retrieving all Manifest documents') }
    return res.json(Manifests)
  })
}

/* *****
  Add a Manifest
***** */
export function add (req, res) {
  Manifest.create(req.body, (err) => {
    if (err) { return res.status(400).send(err) }
    return res.status(200).send('OK')
  })
}

/* *****
  Update a Manifest
***** */
export function update (req, res) {
  const query = { id: req.params.id }
  const omitKeys = ['id', '_id', '_v']
  const data = _.omit(req.body, omitKeys)

  Manifest.findOneAndUpdate(query, data, (err) => {
    if (err) { return res.status(500).send('Server error saving Manifest') }
    return res.status(200).send('Updated successfully')
  })
}

/* *****
  Remove a Manifest
***** */
export function remove (req, res) {
  const query = { id: req.params.id }
  Manifest.findOneAndRemove(query, (err) => {
    if (err) { return res.status(500).send('Server error deleting Manifest') }
    return res.status(200).send('Removed Successfully')
  })
}

export default {
  all,
  add,
  update,
  remove
}
