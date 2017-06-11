export default function loadModels () {
  //  Auth and User data
  require('./user')
  require('./contact')
  //  Community content (mostly endorsements)
  require('./comment')
  //  Proposals
  require('./proposal')
  require('./case') //  a proposal body
  require('./amendment')
  require('./manifest')
  require('./item')
  require('./block')  //  Concise proposals for cont funding
  //  Proposal Meta
  require('./review')
  require('./decision')
  require('./report')
}
