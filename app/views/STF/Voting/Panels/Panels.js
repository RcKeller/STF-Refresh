import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../services'

import { Col, Row, Spin, Tabs } from 'antd'
const TabPane = Tabs.TabPane

import Summary from './Summary/Summary'
import Scores from './Scores/Scores'
import Metrics from './Metrics/Metrics'
import Vote from './Vote/Vote'
import Decision from './Decision/Decision'

const currency = number =>
  number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })
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
      stf: state.user.stf
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
    { index, manifest, stf } = this.props
  ) {
    const { _id, proposal, docket, total } = manifest
    const { id, title, organization, uac, year, number, date, comments } = proposal
    const { metrics, voting, decisions } = docket
    console.log('DOCKET', docket)
    return (
      <section>
        {!proposal
          ? <Spin size='large' tip='Loading...' />
          : <div id={_id} >
            <Row type="flex" justify="space-between" align="top">
              <Col sm={24} lg={12}>
                <h1>{title}</h1>
                {uac && <h4><em>Universal Access Committee</em></h4>}
                <h3>For {organization}</h3>
                <h6 id={id}>{`ID: ${year}-${number}`}</h6>
              </Col>
              <Col sm={24} lg={12} style={{ textAlign: 'right' }}>
                <h2>{currency(total)}</h2>
                <ul>
                  {date && <li>Submitted {new Date(date).toLocaleDateString('en-US')}</li>}
                  <li>{comments.length} Endorsements</li>
                </ul>

              </Col>
            </Row>
            <hr />
            <hr />
            <Tabs defaultActiveKey='1'>
              <TabPane tab={<b>Proposal</b>} key='1'>
                <Summary id={_id} />
              </TabPane>
              <TabPane tab={<b>Scores</b>} key='2'>
                <Scores id={_id} />
              </TabPane>
              <TabPane disabled={!metrics && !voting && !decisions} tab={<b>Metrics</b>} key='3'>
                <Metrics id={_id} />
              </TabPane>
              <TabPane disabled={!voting || !stf.member} tab={<b>Vote</b>} key='4'>
                <Vote id={_id} />
              </TabPane>
              <TabPane disabled={!decisions || !stf.admin} tab={<b>Decision (<em>Admin-Only</em>)</b>} key='5'>
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
