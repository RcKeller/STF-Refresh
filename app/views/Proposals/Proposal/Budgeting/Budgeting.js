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
class Budgeting extends React.Component {
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
        <h1>Budgeting</h1>
        <h3>{`Organization Budget Code: ${budget}`}</h3>
        <p>Here you can record your recent expenditures as part of the STF process...</p>
        <Tabs>
          {approvedManifests.length > 0 &&
            <TabPane tab={<b>Report Expenditures</b>} key='1'>
              <Tabs tabPosition='left' size='small' defaultActiveKey={`${approvedManifests.length - 1}`}>
                {approvedManifests.map((indexInStore, i) => (
                  <TabPane key={i} tab={<span>{_.capitalize(manifests[indexInStore].type)}<br />{`Award (#${++i})`}</span>} >
                  <p>Instructions...</p>
                    <Report awardNumber={++i} indexInStore={indexInStore} />
                  </TabPane>
                ))}
              </Tabs>
            </TabPane>
          }
          {approvedManifests.length > 0 &&
            <TabPane tab={<b>Request Supplemental Funding</b>} key='2'>
              <Supplemental />
            </TabPane>
          }
          {stf && stf.admin &&
            <TabPane tab={<b>Auditing (<em>STF-Only</em>)</b>} key='3'>
              <Audit />
            </TabPane>
          }
        </Tabs>
        {/* {approvedManifests.length < 1
          ? <em>No awards dispersed, cannot fill budget reports.</em>
          : <Tabs tabPosition='left' size='small' defaultActiveKey={`${approvedManifests.length - 1}`}>
            {approvedManifests.map((indexInStore, i) => (
              <TabPane key={i} tab={<span>{_.capitalize(manifests[indexInStore].type)}<br />{`Award (#${++i})`}</span>} >
                <Report awardNumber={++i} indexInStore={indexInStore} />
              </TabPane>
            ))}
          </Tabs>
        }
        {approvedManifests.length > 0 && <Supplemental />}
        {stf && stf.admin && <Audit />} */}
      </section>
    )
  }
}

Budgeting.propTypes = {
  report: PropTypes.object
}
export default Budgeting
