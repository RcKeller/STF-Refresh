import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

@connect(state => ({
  contacts: state.db.proposal.contacts,
  report: state.db.proposal.report
}))
class Report extends React.Component {
  render ({ report } = this.props) {
    return (
      <section>
        <h1>Budget Reporting</h1>
        <h6>For internal use only.</h6>
        <p>Lorem ipsum, why we do this...</p>
      </section>
    )
  }
}

Report.propTypes = {
  report: PropTypes.object
}
export default Report
