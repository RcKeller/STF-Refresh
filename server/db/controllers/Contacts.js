import passport from 'passport'
import Contact from '../models/Contact'

/**
 * List
 */
export function all (req, res) {
  Contact.find({}).exec((err, Contacts) => {
    if (err) {
      console.log('Error in first query')
      return res.status(500).send('Something went wrong getting the data')
    }
    return res.json(Contacts)
  })
}

/**
 * Add a Contact
 */
export function add (req, res) {
  Contact.create(req.body, (err) => {
    if (err) {
      console.log(err)
      return res.status(400).send(err)
    }
    return res.status(200).send('OK')
  })
}

/**
 * Update a Contact
 */
export function update (req, res) {
  const query = { id: req.params.id }
  const omitKeys = ['id', '_id', '_v']
  const data = _.omit(req.body, omitKeys)

  Contact.findOneAndUpdate(query, data, (err) => {
    if (err) {
      console.log('Error on save!')
      return res.status(500).send('We failed to save for some reason')
    }
    return res.status(200).send('Updated successfully')
  })
}

/**
 * Remove a Contact
 */
export function remove (req, res) {
  const query = { id: req.params.id }
  Contact.findOneAndRemove(query, (err) => {
    if (err) {
      console.log('Error on delete')
      return res.status(500).send('We failed to delete for some reason')
    }
    return res.status(200).send('Removed Successfully')
  })
}

export default {
  all,
  add,
  update,
  remove
}
