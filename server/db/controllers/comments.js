import passport from 'passport'
import Comment from '../models/comment'

/* *****
  List
***** */
export function all (req, res) {
  Comment.find({}).exec((err, Comments) => {
    if (err) { return res.status(500).send('Server error retrieving all Comment documents') }
    return res.json(Comments)
  })
}

/* *****
  Add a Comment
***** */
export function add (req, res) {
  Comment.create(req.body, (err) => {
    if (err) { return res.status(400).send(err) }
    return res.status(200).send('OK')
  })
}

/* *****
  Update a Comment
***** */
export function update (req, res) {
  const query = { id: req.params.id }
  const omitKeys = ['id', '_id', '_v']
  const data = _.omit(req.body, omitKeys)

  Comment.findOneAndUpdate(query, data, (err) => {
    if (err) { return res.status(500).send('Server error saving Comment') }
    return res.status(200).send('Updated successfully')
  })
}

/* *****
  Remove a Comment
***** */
export function remove (req, res) {
  const query = { id: req.params.id }
  Comment.findOneAndRemove(query, (err) => {
    if (err) { return res.status(500).send('Server error deleting Comment') }
    return res.status(200).send('Removed Successfully')
  })
}

export default {
  all,
  add,
  update,
  remove
}
