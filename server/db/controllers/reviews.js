import passport from 'passport'
import Review from '../models/review'

/* *****
  List
***** */
export function all (req, res) {
  Review.find({}).exec((err, Reviews) => {
    if (err) { return res.status(500).send('Server error retrieving all Review documents') }
    return res.json(Reviews)
  })
}

/* *****
  Add a Review
***** */
export function add (req, res) {
  Review.create(req.body, (err) => {
    if (err) { return res.status(400).send(err) }
    return res.status(200).send('OK')
  })
}

/* *****
  Update a Review
***** */
export function update (req, res) {
  const query = { id: req.params.id }
  const omitKeys = ['id', '_id', '_v']
  const data = _.omit(req.body, omitKeys)

  Review.findOneAndUpdate(query, data, (err) => {
    if (err) { return res.status(500).send('Server error saving Review') }
    return res.status(200).send('Updated successfully')
  })
}

/* *****
  Remove a Review
***** */
export function remove (req, res) {
  const query = { id: req.params.id }
  Review.findOneAndRemove(query, (err) => {
    if (err) { return res.status(500).send('Server error deleting Review') }
    return res.status(200).send('Removed Successfully')
  })
}

export default {
  all,
  add,
  update,
  remove
}
