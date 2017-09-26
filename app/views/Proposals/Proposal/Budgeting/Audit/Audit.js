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
      </section>
    )
  }
}

export default Audit
