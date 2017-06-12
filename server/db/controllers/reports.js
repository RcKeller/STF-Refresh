import _ from 'lodash'
import Report from '../models/report'

/* *****
  List
***** */
export function all (req, res) {
  Report.find({}).exec((err, Reports) => {
    if (err) { return res.status(500).send('Server error retrieving all Report documents') }
    return res.json(Reports)
  })
}

/* *****
  Add a Report
***** */
export function add (req, res) {
  Report.create(req.body, (err) => {
    if (err) { return res.status(400).send(err) }
    return res.status(200).send('OK')
  })
}

/* *****
  Update a Report
***** */
export function update (req, res) {
  const query = { id: req.params.id }
  const omitKeys = ['id', '_id', '_v']
  const data = _.omit(req.body, omitKeys)

  Report.findOneAndUpdate(query, data, (err) => {
    if (err) { return res.status(500).send('Server error saving Report') }
    return res.status(200).send('Updated successfully')
  })
}

/* *****
  Remove a Report
***** */
export function remove (req, res) {
  const query = { id: req.params.id }
  Report.findOneAndRemove(query, (err) => {
    if (err) { return res.status(500).send('Server error deleting Report') }
    return res.status(200).send('Removed Successfully')
  })
}

export default {
  all,
  add,
  update,
  remove
}
