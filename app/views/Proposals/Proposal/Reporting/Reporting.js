import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import _ from 'lodash'

import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

import Report from './Report/Report'
import Supplemental from './Supplemental/Supplemental'
import Audit from './Audit/Audit'

@connect(state => ({
  budget: state.db.proposal.budget,
  manifests: state.db.proposal.manifests,
  stf: state.user && state.user.stf
}))
class Reporting extends React.Component {
  render ({ budget, manifests, stf } = this.props) {
    //  Reduce an array that contains all indexes for approved manifests, make a report for each.
    const approvedManifests = manifests.reduce((required, manifest) => {
      //  If approved, add the index of this manifest to an array. Pass to children so it can be selected in store.
      if (manifest.decision.approved) {
        required.push(manifests.indexOf(manifest))
      }
      return required
    }, [])
    return (
      <section>
        <h1>Budget Reporting</h1>
        <h3>{`Organization Budget Code: ${budget}`}</h3>
        <p>Here you can record your recent expenditures as part of the STF process...</p>
        {approvedManifests.length < 1
          ? <em>No awards dispersed, cannot fill budget reports.</em>
          : <Tabs tabPosition='left' size='small' defaultActiveKey={`${approvedManifests.length - 1}`}>
            {approvedManifests.map((indexInStore, i) => (
              <TabPane key={i} tab={<span>{_.capitalize(manifests[indexInStore].type)}<br />{`Award (#${++i})`}</span>} >
                <Report awardNumber={++i} indexInStore={indexInStore} />
              </TabPane>
            ))}
          </Tabs>
        }
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
