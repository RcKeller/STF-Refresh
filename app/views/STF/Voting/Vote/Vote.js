import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../services'

import { Spin, Tabs } from 'antd'
const TabPane = Tabs.TabPane

import SummaryPane from './SummaryPane/SummaryPane'
import MetricsPane from './MetricsPane/MetricsPane'
import VotingPane from './VotingPane/VotingPane'
/*
There are two kinds of meetings:
- QA meetings (metrics, no votes)
- Voting meetings (votes, may have metrics but probably not)
*/
@connect(
    //  Might seem counterintuitive, but we're connecting to a manifest and pulling its proposal data.
    (state, props) => ({
      manifest: state.db.manifests[props.index],
      // proposal: state.db.manifests[props.index].proposal,
      user: state.user
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
)
class Vote extends React.Component {
  render (
    { index, manifest } = this.props
  ) {
    const { proposal, docket } = manifest
    const { id, title, organization, uac, year, number, date, comments } = proposal
    const { metrics, voting } = docket
    console.log('DOCKET', docket)
    return (
      <section>
        {!proposal
          ? <Spin size='large' tip='Loading...' />
          : <div>
            <hr />
            <h1>{uac ? title : `${title} (UAC)`}</h1>
            {uac && <h2>Universal Access Committee</h2>}
            <h3>For {organization}</h3>
            <h6 id={id}>{`ID: ${year}-${number}`}</h6>
            <ul>
              <li>Date: {date}</li>
              <li>Endorsements: {comments.length}</li>
            </ul>
            <hr />
            <Tabs tabPosition='left' size='small' defaultActiveKey='1'>
              <TabPane tab='Summary' key='1'>
                <SummaryPane index={index} />
              </TabPane>
              {metrics &&
                <TabPane tab='Metrics' key='2'>
                  <MetricsPane index={index} />
                </TabPane>
              }
              {voting &&
                <TabPane tab='Voting' key='3'>
                  <VotingPane index={index} />
                </TabPane>
              }
            </Tabs>
          </div>
        }
      </section>
    )
  }
}
Vote.propTypes = {
  manifest: PropTypes.object,
  user: PropTypes.object
}
export default Vote
