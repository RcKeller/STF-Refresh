import _ from 'lodash'
import Decision from '../models/decision'

/* *****
  List
***** */
export function all (req, res) {
  Decision.find({}).exec((err, Decisions) => {
    if (err) { return res.status(500).send('Server error retrieving all Decision documents') }
    return res.json(Decisions)
  })
}

/* *****
  Add a Decision
***** */
export function add (req, res) {
  Decision.create(req.body, (err) => {
    if (err) { return res.status(400).send(err) }
    return res.status(200).send('OK')
  })
}

/* *****
  Update a Decision
***** */
export function update (req, res) {
  const query = { id: req.params.id }
  const omitKeys = ['id', '_id', '_v']
  const data = _.omit(req.body, omitKeys)

  Decision.findOneAndUpdate(query, data, (err) => {
    if (err) { return res.status(500).send('Server error saving Decision') }
    return res.status(200).send('Updated successfully')
  })
}

/* *****
  Remove a Decision
***** */
export function remove (req, res) {
  const query = { id: req.params.id }
  Decision.findOneAndRemove(query, (err) => {
    if (err) { return res.status(500).send('Server error deleting Decision') }
    return res.status(200).send('Removed Successfully')
  })
}

export default {
  all,
  add,
  update,
  remove
}
