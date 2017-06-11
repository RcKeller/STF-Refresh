import passport from 'passport'
import Block from '../models/block'

/* *****
  List
***** */
export function all (req, res) {
  Block.find({}).exec((err, Blocks) => {
    if (err) { return res.status(500).send('Server error retrieving all Block documents') }
    return res.json(Blocks)
  })
}

/* *****
  Add a Block
***** */
export function add (req, res) {
  Block.create(req.body, (err) => {
    if (err) { return res.status(400).send(err) }
    return res.status(200).send('OK')
  })
}

/* *****
  Update a Block
***** */
export function update (req, res) {
  const query = { id: req.params.id }
  const omitKeys = ['id', '_id', '_v']
  const data = _.omit(req.body, omitKeys)

  Block.findOneAndUpdate(query, data, (err) => {
    if (err) { return res.status(500).send('Server error saving Block') }
    return res.status(200).send('Updated successfully')
  })
}

/* *****
  Remove a Block
***** */
export function remove (req, res) {
  const query = { id: req.params.id }
  Block.findOneAndRemove(query, (err) => {
    if (err) { return res.status(500).send('Server error deleting Block') }
    return res.status(200).send('Removed Successfully')
  })
}

export default {
  all,
  add,
  update,
  remove
}
