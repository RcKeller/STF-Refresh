import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import _ from 'lodash'

import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

import Report from './Report/Report'
import Supplemental from './Supplemental/Supplemental'
import Partial from './Partial/Partial'

/*
BUDGETING TAB:
Provides the ability to create partails at a minimum
For proposals that have received an award,
it allows them to report expenses and request addtl. funding
*/
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
          <TabPane disabled={approvedManifests.length <= 0} tab='Request Award Supplement' key='2'>
            <Supplemental indexInStore={approvedManifests.length - 1} />
          </TabPane>
          <TabPane tab='Partial / Alternative Budgets' key='3'>
            <Partial />
          </TabPane>
        </Tabs>
      </section>
    )
  }
}

export default Budgeting
