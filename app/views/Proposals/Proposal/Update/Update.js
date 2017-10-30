import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Link } from 'react-router'

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
        <h1>Post-Submission Updates</h1>
        <Alert type='info' showIcon banner
          // message='Minor Edits'
          message='For typos and minor corrections, e-mail stfagent@uw.edu to request revisions. For major corrections, we suggest withdrawing this proposal and re-submitting next quarter.'
        />
        <h2>Contact Information</h2>
        <p>Life happens and authors may not always stay involved with projects on a continuing basis. Because of this, you may appoint someone else with your same position, given you have their information.</p>
        {contacts.map((e, i) => (
          <UpdateContact key={e._id} indexInStore={i} />
        ))}
      </section>
    )
  }
}

export default Update
