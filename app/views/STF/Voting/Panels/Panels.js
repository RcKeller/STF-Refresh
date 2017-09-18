import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../services'

import { Spin, Tabs } from 'antd'
const TabPane = Tabs.TabPane

import Summary from './Summary/Summary'
import Metrics from './Metrics/Metrics'
import Review from './Review/Review'
import Decision from './Decision/Decision'
/*
There are two kinds of meetings:
- QA meetings (metrics, no votes)
- Voting meetings (votes, may have metrics but probably not)
*/
@connect(
    //  Might seem counterintuitive, but we're connecting to a manifest and pulling its proposal data.
    (state, props) => ({
      manifest: state.db.manifests
        .find(manifest => manifest._id === props.id),
      admin: state.user.stf.admin
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
)
class Panels extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    manifest: PropTypes.object,
    admin: PropTypes.object
  }
  render (
    { index, manifest, admin } = this.props
  ) {
    const { _id, proposal, docket } = manifest
    const { id, title, organization, uac, year, number, date, comments } = proposal
    const { metrics, voting, decisions } = docket
    console.log('DOCKET', docket)
    return (
      <section>
        {!proposal
          ? <Spin size='large' tip='Loading...' />
          : <div id={_id} >
            <h1>{title}</h1>
            {uac && <h2>Universal Access Committee</h2>}
            <h3>For {organization}</h3>
            <h6 id={id}>{`ID: ${year}-${number}`}</h6>
            <ul>
              <li>Date: {date}</li>
              <li>Endorsements: {comments.length}</li>
            </ul>
            <Tabs defaultActiveKey='1'>
              <TabPane tab={<b>Summary</b>} key='1'>
                <Summary id={_id} />
              </TabPane>
              <TabPane tab={<b>Metrics</b>} key='2'>
                <Metrics id={_id} />
              </TabPane>
              <TabPane disabled={!metrics} tab={<b>Review</b>} key='3'>
                <Review id={_id} />
              </TabPane>
              <TabPane disabled={!voting} tab={<b>Vote</b>} key='4'>
                <div>Vote</div>
              </TabPane>
              <TabPane disabled={!admin || !decisions} tab={<b>Decision (<em>Admin-Only</em>)</b>} key='5'>
                <Decision id={_id} />
              </TabPane>
            </Tabs>
          </div>
        }
      </section>
    )
  }
}

export default Panels
