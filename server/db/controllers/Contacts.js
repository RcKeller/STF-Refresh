import _ from 'lodash'
import Contact from '../models/contact'

/* *****
  List
***** */
export function all (req, res) {
  Contact.find({}).exec((err, Contacts) => {
    if (err) { return res.status(500).send('Server error retrieving all Contact documents') }
    return res.json(Contacts)
  })
}

/* *****
  Add a Contact
***** */
export function add (req, res) {
  Contact.create(req.body, (err) => {
    if (err) { return res.status(400).send(err) }
    return res.status(200).send('OK')
  })
}

/* *****
  Update a Contact
***** */
export function update (req, res) {
  const query = { id: req.params.id }
  const omitKeys = ['id', '_id', '_v']
  const data = _.omit(req.body, omitKeys)

  Contact.findOneAndUpdate(query, data, (err) => {
    if (err) { return res.status(500).send('Server error saving Contact') }
    return res.status(200).send('Updated successfully')
  })
}

/* *****
  Remove a Contact
***** */
export function remove (req, res) {
  const query = { id: req.params.id }
  Contact.findOneAndRemove(query, (err) => {
    if (err) { return res.status(500).send('Server error deleting Contact') }
    return res.status(200).send('Removed Successfully')
  })
}

export default {
  all,
  add,
  update,
  remove
}
