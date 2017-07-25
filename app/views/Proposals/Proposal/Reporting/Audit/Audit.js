import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

@connect(state => ({
  contacts: state.db.proposal.contacts,
  report: state.db.proposal.report
}))
class Audit extends React.Component {
  render ({ report } = this.props) {
    return (
      <section>
        <h1>Proposal Auditing</h1>
        <h6>For internal use only.</h6>
        <p>Lorem ipsum...</p>
      </section>
    )
  }
}

Audit.propTypes = {
  report: PropTypes.object
}
export default Audit
