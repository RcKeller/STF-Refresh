import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

@connect(state => ({
  contacts: state.db.proposal.contacts,
  reports: state.db.proposal.reports
}))
class Audit extends React.Component {
  render ({ report } = this.props) {
    return (
      <section>
        <h1>Proposal Auditing</h1>
        <h6>For internal use only.</h6>
        <p>This page is under construction and is a feature that will ship post-launch.</p>
      </section>
    )
  }
}

Audit.propTypes = {
  report: PropTypes.object
}
export default Audit
