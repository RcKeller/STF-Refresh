import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import Report from './Report/Report'
import Supplemental from './Supplemental/Supplemental'
import Audit from './Audit/Audit'

@connect(state => ({
  //  Reduce an array that contains all indexes for approved manifests, make a report for each.
  budget: state.db.proposal.budget,
  approvedManifests: state.db.proposal.manifests
    .reduce((required, manifest) => {
      //  If approved, add the index of this manifest to an array. Pass to children so it can be selected in store.
      if (manifest.decision.approved) {
        required.push(state.db.proposal.manifests.indexOf(manifest))
      }
      return required
    }, []),
  stf: state.user && state.user.stf
}))
class Reporting extends React.Component {
  render ({ budget, approvedManifests, stf } = this.props) {
    return (
      <section>
        <h1>Budget Reporting</h1>
        <h3>{`Organization Budget Code: ${budget}`}</h3>
        <p>Here you can record your recent expenditures as part of the STF process...</p>
        {approvedManifests.length < 1
          ? <em>No awards dispersed, cannot fill budget reports.</em>
          : approvedManifests.map((indexInStore, i) => (
            <Report key={i} awardNumber={++i} indexInStore={indexInStore} />
        ))}
        <Supplemental />
        {stf && stf.admin && <Audit />}
      </section>
    )
  }
}

Reporting.propTypes = {
  report: PropTypes.object
}
export default Reporting
