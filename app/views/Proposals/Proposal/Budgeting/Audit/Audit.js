import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

@connect(state => ({
  contacts: state.db.proposal.contacts,
  reports: state.db.proposal.reports
}))
class Audit extends React.Component {
  static propTypes = {
    report: PropTypes.object
  }
  render ({ report } = this.props) {
    return (
      <section>
        <h1>Proposal Auditing</h1>
        <h6>For internal use only.</h6>
        <p>This page is under construction and is a feature that will ship post-launch.</p>
        <p className='demo-note' style={{ color: 'red' }}>(Katie, I'm sorry that I didn't have enough time to build out auditing pre-launch. You and I will work very closely to make sure the site gets a lot of love and built-in tools for your job functions)</p>
      </section>
    )
  }
}

export default Audit
