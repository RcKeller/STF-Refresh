import _ from 'lodash'
import Item from '../models/item'

/* *****
  List
***** */
export function all (req, res) {
  Item.find({}).exec((err, Items) => {
    if (err) { return res.status(500).send('Server error retrieving all Item documents') }
    return res.json(Items)
  })
}

/* *****
  Add a Item
***** */
export function add (req, res) {
  Item.create(req.body, (err) => {
    if (err) { return res.status(400).send(err) }
    return res.status(200).send('OK')
  })
}

/* *****
  Update a Item
***** */
export function update (req, res) {
  const query = { id: req.params.id }
  const omitKeys = ['id', '_id', '_v']
  const data = _.omit(req.body, omitKeys)

  Item.findOneAndUpdate(query, data, (err) => {
    if (err) { return res.status(500).send('Server error saving Item') }
    return res.status(200).send('Updated successfully')
  })
}

/* *****
  Remove a Item
***** */
export function remove (req, res) {
  const query = { id: req.params.id }
  Item.findOneAndRemove(query, (err) => {
    if (err) { return res.status(500).send('Server error deleting Item') }
    return res.status(200).send('Removed Successfully')
  })
}

export default {
  all,
  add,
  update,
  remove
}
