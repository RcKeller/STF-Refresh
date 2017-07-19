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
const isContact = (contacts, user) => contacts.filter(obj => obj.netID === user.netID)[0]
/*
Util for redirecting unaffiliated users from CRUD pages, like editing proposals.
Best used in the render method, because you can skip lifecycle methods with the back button in some browsers.
render ({ contacts, user } = this.props) {
  proposal && redirectUnaffiliated(contacts, user)
  ...
}
*/
const redirectUnaffiliated = (user, contacts) => {
  //  Only redirect if there's an actual set of authorized users.
  //  This gives users who accidentally delete their info a chance to correct that.
  if (contacts.length >= 1) {
    let authorized = []
    for (let c of contacts) authorized.push(c.netID)
    if (!authorized.includes(user.netID)) {
      browserHistory.push(`/`)
      message.warning(`Sorry! ${user.netID} is unauthorized to visit this page. Authorized users include: ${authorized}`, 10)
    }
  }
}

export {
  getRole,
  isContact,
  redirectUnaffiliated
}
