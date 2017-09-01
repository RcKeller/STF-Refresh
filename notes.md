Use mongoose-autoref plugin

To update a proposal in a duck:

get the proposal without population, for the references.
patch the proposal using _lodash to omit() ref fields. - updates core proposal
patch the individual refs as necessary. - e.g. patch({ model: 'contact', id: proposal.contacts[0]._id })
using mongoose-autoref, proposal ObjectIds automatically update.

Psuedocode:
const proposal
const proposalRefs= omit(get(proposal), [array of non ref fields]
const proposalData = omit(proposal, ref fields)
patch(proposal)
patch( { contact, proposal.contact[0]._id })


https://www.npmjs.com/package/mongoose-autorefs

ALTERNATIVE:
use pre('save') middleware in mongoose to handle updating refs and such.
