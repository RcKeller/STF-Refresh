import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

@connect(state => ({
  contacts: state.db.proposal.contacts,
  report: state.db.proposal.report
}))
class Supplemental extends React.Component {
  render ({ report } = this.props) {
    return (
      <section>
        <h1>Supplemental Awards</h1>
        <h6>For proposals that face an unforseen increase in budgetary needs</h6>
        <p>Lorem ipsum... </p>
      </section>
    )
  }
}

Supplemental.propTypes = {
  report: PropTypes.object
}
export default Supplemental
