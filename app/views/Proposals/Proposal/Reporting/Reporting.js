import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import Report from './Report/Report'
import Supplemental from './Supplemental/Supplemental'
import Audit from './Audit/Audit'

@connect(state => ({
  // stf: state.user.stf
  //  TODO: Placeholder
  stf: { admin: true }
}))
class Reporting extends React.Component {
  render ({ report, stf: { admin } } = this.props) {
    return (
      <section>
        <Report />
        <Supplemental />
        {admin && <Audit />}
      </section>
    )
  }
}

Reporting.propTypes = {
  report: PropTypes.object
}
export default Reporting
