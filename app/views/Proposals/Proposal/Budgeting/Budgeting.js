import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import _ from 'lodash'

import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

import Report from './Report/Report'
import Supplemental from './Supplemental/Supplemental'
import Partial from './Partial/Partial'
// import Audit from './Audit/Audit'

@connect(state => ({
  budget: state.db.proposal.budget,
  manifests: state.db.proposal.manifests,
  stf: state.user && state.user.stf
}))
class Budgeting extends React.Component {
  static propTypes = {
    report: PropTypes.object
  }
  render ({ budget, manifests, stf } = this.props) {
    //  Reduce an array that contains all indexes for approved manifests, make a report for each.
    const approvedManifests = manifests.reduce((required, manifest) => {
      //  If approved, add the index of this manifest to an array. Pass to children so it can be selected in store.
      if (manifest.decision && manifest.decision.approved) {
        required.push(manifests.indexOf(manifest))
      }
      return required
    }, [])
    return (
      <section>
        <h1>Budgeting</h1>
        {budget && <h3>{`Organization Budget Code: ${budget}`}</h3>}
        {approvedManifests.length <= 0 &&
          <em>This proposal has not received funding, so advanced budgeting tools are unavailable for now.</em>
        }
        <Tabs>
          <TabPane disabled={approvedManifests.length <= 0} tab='Expense Reporting' key='1'>
            <Tabs size='small' defaultActiveKey={`${approvedManifests.length - 1}`}>
              {approvedManifests.map((indexInStore, i) => (
                <TabPane key={i} tab={<span>{_.capitalize(manifests[indexInStore].type)}<br />{`Award (#${++i})`}</span>} >
                  <Report awardNumber={++i} indexInStore={indexInStore} />
                </TabPane>
              ))}
            </Tabs>
          </TabPane>
          <TabPane disabled={approvedManifests.length <= 0} tab='Supplemental Funding' key='2'>
            <Supplemental indexInStore={approvedManifests.length - 1} />
          </TabPane>
          <TabPane tab='Partial Budgets' key='3'>
            <Partial />
          </TabPane>
          {/* {stf && stf.admin &&
            <TabPane tab={<span>Auditing (<em>Admin-Only</em>)</span>} key='4'>
              <Audit />
            </TabPane>
          } */}
        </Tabs>
      </section>
    )
  }
}

export default Budgeting
