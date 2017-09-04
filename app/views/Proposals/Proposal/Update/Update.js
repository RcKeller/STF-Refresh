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
        <h1 className='demo-note' style={{ color: 'goldenrod' }}>REVISION NEEDED / UP FOR DEBATE</h1>
        <p className='demo-note' style={{ color: 'goldenrod' }}>I need very clear verbage indicating that updating proposal contact info is an ongoing responsibility, as well as some verbage to push people who want to change their content to either A) contact the proposal officer (verbage fixes) or B) Submit a brand new proposal.</p>
        <p className='demo-note' style={{ color: 'goldenrod' }}>Having people edit their content post-publication is a very very bad idea, that gives malicious users repudiation. I considered having a "withdraw proposal" button here, but I'd be afraid of that being either A) abused or B) circumventing the proposal officer, who could identify very important concerns by having a direct discussion with proposal authors.</p>
        <Alert type='warning'
          message='Grace Period'
          description={<span>
            As part of regulatory compliance, the content of a proposal cannot be edited once it undergoes review. However, since a proposal is never reviewed during the week it was submitted, we've added a one-week grace period for authors to make revisions. <Link to={`/edit/${id}`}>Click here!</Link>
          </span>}
        />
        <h2>Contact Information</h2>
        <p>Life happens and authors may not always stay involved with projects on a continuing basis. Because of this, you may appoint someone else with your same position, given you have their information.</p>
        {contacts.map((e, i) => (
          <UpdateContact key={e._id} indexInStore={i} />
        ))}
        <Alert type='info' showIcon={false} banner
          message='Minor Edits'
          description='For typos and minor corrections, e-mail stfagent@uw.edu to have your revisions approved. For major corrections, we suggest withdrawing this proposal and re-submitting a new one.'
        />
      </section>
    )
  }
}

export default Update
