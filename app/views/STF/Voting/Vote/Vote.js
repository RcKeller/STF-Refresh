import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../services'

import { Spin, Tabs } from 'antd'
const TabPane = Tabs.TabPane

import Summary from './Summary/Summary'
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
      manifest: state.db.manifests[props.index],
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
    const { metrics, voting, decisions } = docket
    console.log('DOCKET', docket)
    return (
      <section>
        {!proposal
          ? <Spin size='large' tip='Loading...' />
          : <div>
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
                <Summary index={index} />
              </TabPane>
              <TabPane disabled={!metrics && !voting} tab={<b>Review</b>} key='2'>
                <Review index={index} />
              </TabPane>
              <TabPane disabled={!decisions} tab={<b>Decision</b>} key='3'>
                <Decision index={index} />
              </TabPane>
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
