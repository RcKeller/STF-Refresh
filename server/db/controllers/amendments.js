import passport from 'passport'
import Amendment from '../models/amendment'

/* *****
  List
***** */
export function all (req, res) {
  Amendment.find({}).exec((err, Amendments) => {
    if (err) { return res.status(500).send('Server error retrieving all Amendment documents') }
    return res.json(Amendments)
  })
}

/* *****
  Add a Amendment
***** */
export function add (req, res) {
  Amendment.create(req.body, (err) => {
    if (err) { return res.status(400).send(err) }
    return res.status(200).send('OK')
  })
}

/* *****
  Update a Amendment
***** */
export function update (req, res) {
  const query = { id: req.params.id }
  const omitKeys = ['id', '_id', '_v']
  const data = _.omit(req.body, omitKeys)

  Amendment.findOneAndUpdate(query, data, (err) => {
    if (err) { return res.status(500).send('Server error saving Amendment') }
    return res.status(200).send('Updated successfully')
  })
}

/* *****
  Remove a Amendment
***** */
export function remove (req, res) {
  const query = { id: req.params.id }
  Amendment.findOneAndRemove(query, (err) => {
    if (err) { return res.status(500).send('Server error deleting Amendment') }
    return res.status(200).send('Removed Successfully')
  })
}

export default {
  all,
  add,
  update,
  remove
}
