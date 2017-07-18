import { browserHistory } from 'react-router'
import { message } from 'antd'
/*
Given a list of contacts, select a specific role, like the primary PoC
connect((state, props) => ({
  parent: state.db.proposal._id,
  contact: getRole(state.db.proposal.contacts, props.role)
}))
*/
const getRole = (contacts, role) => contacts.filter(obj => obj.role === role)[0]
//  Check to see if someone is authorized to perform actions on a proposal.
const isContact = (contacts, netID) => contacts.filter(obj => obj.netID === netID)[0]

const redirectUnaffiliated = (contacts, netID) => {
  let authorized = []
  contacts.map(c => authorized.push(c.netID))
  console.log(authorized)
  if (!authorized.includes(netID)) {
    browserHistory.push(`/`)
    message.warning(`Sorry! ${netID} is unauthorized to visit this page. Authorized users include: ${authorized.join(',', ' ')}`, 10)
  }
}

export {
  getRole,
  isContact,
  redirectUnaffiliated
}
