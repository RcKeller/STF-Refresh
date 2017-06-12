import _ from 'lodash'
import Proposal from '../models/proposal'

/* *****
  List
***** */
export function all (req, res) {
  Proposal.find({}).exec((err, Proposals) => {
    if (err) { return res.status(500).send('Server error retrieving all Proposal documents') }
    return res.json(Proposals)
  })
}

/* *****
  Add a Proposal
***** */
export function add (req, res) {
  Proposal.create(req.body, (err) => {
    if (err) { return res.status(400).send(err) }
    return res.status(200).send('OK')
  })
}

/* *****
  Update a Proposal
***** */
export function update (req, res) {
  const query = { id: req.params.id }
  const omitKeys = ['id', '_id', '_v']
  const data = _.omit(req.body, omitKeys)

  Proposal.findOneAndUpdate(query, data, (err) => {
    if (err) { return res.status(500).send('Server error saving Proposal') }
    return res.status(200).send('Updated successfully')
  })
}

/* *****
  Remove a Proposal
***** */
export function remove (req, res) {
  const query = { id: req.params.id }
  Proposal.findOneAndRemove(query, (err) => {
    if (err) { return res.status(500).send('Server error deleting Proposal') }
    return res.status(200).send('Removed Successfully')
  })
}

export default {
  all,
  add,
  update,
  remove
}
