import _ from 'lodash'
import Case from '../models/case'

/* *****
  List
***** */
export function all (req, res) {
  Case.find({}).exec((err, Cases) => {
    if (err) { return res.status(500).send('Server error retrieving all Case documents') }
    return res.json(Cases)
  })
}

/* *****
  Add a Case
***** */
export function add (req, res) {
  Case.create(req.body, (err) => {
    if (err) { return res.status(400).send(err) }
    return res.status(200).send('OK')
  })
}

/* *****
  Update a Case
***** */
export function update (req, res) {
  const query = { id: req.params.id }
  const omitKeys = ['id', '_id', '_v']
  const data = _.omit(req.body, omitKeys)

  Case.findOneAndUpdate(query, data, (err) => {
    if (err) { return res.status(500).send('Server error saving Case') }
    return res.status(200).send('Updated successfully')
  })
}

/* *****
  Remove a Case
***** */
export function remove (req, res) {
  const query = { id: req.params.id }
  Case.findOneAndRemove(query, (err) => {
    if (err) { return res.status(500).send('Server error deleting Case') }
    return res.status(200).send('Removed Successfully')
  })
}

export default {
  all,
  add,
  update,
  remove
}
