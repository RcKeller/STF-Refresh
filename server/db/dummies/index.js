import config from 'config'

import dummyContacts from './contact'
//  For faking Object ID's. THESE WILL BE RANDOM AND NOT POINT TO REAL DATA.

export default function () {
  const min = config.has('lorem-ipsum') ? config.get('lorem-ipsum') : 5 // default
  console.log(`SEED: Lorem Ipsum Mode enabled. Seeding up to ${min} documents each...`)

  dummyContacts(min)
}

// export default function loadModels () {
//   //  Auth and User data
//   require('./user')
//   require('./contact')
//   //  Community content (mostly endorsements)
//   require('./comment')
//   //  Proposals
//   require('./proposal')
//   require('./case') //  a proposal body
//   require('./amendment')
//   require('./manifest')
//   require('./item')
//   require('./block')  //  Concise proposals for cont funding
//   //  Proposal Meta
//   require('./review')
//   require('./decision')
//   require('./report')
// }
