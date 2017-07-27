import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

@connect(state => ({
  contacts: state.db.proposal.contacts,
  budget: state.db.proposal.budget,
  report: state.db.proposal.report
}))
class Report extends React.Component {
  render ({ budget, report } = this.props) {
    return (
      <section>
        <h1>Budget Reporting</h1>
        <h3>{`Organization Budget Code: ${budget}`}</h3>
        <p>Lorem ipsum, why we do this...</p>
      </section>
    )
  }
}

Report.propTypes = {
  report: PropTypes.object
}
export default Report
