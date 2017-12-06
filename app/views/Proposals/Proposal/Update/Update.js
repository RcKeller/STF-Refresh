import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Alert } from 'antd'

import UpdateContact from './UpdateContact/UpdateContact'

@connect(state => ({
  date: state.db.proposal.date,
  contacts: state.db.proposal.contacts
}))
class Update extends React.Component {
  static propTypes = {
    contacts: PropTypes.array
  }
  render ({ id, date, contacts } = this.props) {
    return (
      <section>
        <Alert type='info' showIcon banner
          message='Minor Updates'
          description='Life happens and authors may not always stay involved with projects on a continuing basis. Because of this, you may appoint someone else with your same position, given you have their information. For typos and minor corrections, e-mail stfagent@uw.edu to request revisions. For major corrections, we suggest withdrawing this proposal and re-submitting next quarter.'
        />
        {contacts.map((e, i) => (
          <UpdateContact key={e._id} indexInStore={i} />
        ))}
      </section>
    )
  }
}

export default Update
