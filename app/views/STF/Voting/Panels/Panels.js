import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../services'

import { Col, Row, Spin, Tabs, Tooltip } from 'antd'
const TabPane = Tabs.TabPane

import Summary from './Summary/Summary'
import Budget from './Budget/Budget'
import Scores from './Scores/Scores'
import Metrics from './Metrics/Metrics'
import Vote from './Vote/Vote'
import Decision from './Decision/Decision'

const currency = number =>
  number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })
const capitalize = (word) => word[0].toUpperCase() + word.substr(1)
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
    const { _id, type, proposal, docket, total } = manifest
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
                <h1><em>{capitalize(type)}</em> - {title}</h1>
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
              <TabPane tab='Summary' key='1'>
                <Summary id={_id} />
              </TabPane>
              <TabPane tab='Budget' key='2'>
                <Budget id={_id} />
              </TabPane>
              <TabPane tab={<Tooltip placement='top' title='View committee votes & metrics'>Scores</Tooltip>} key='3'>
                <Scores id={_id} />
              </TabPane>
              <TabPane disabled={!metrics && !voting && !decisions} tab={<Tooltip placement='top' title='Score this proposal by merits.'>Metrics</Tooltip>} key='4'>
                <Metrics id={_id} />
              </TabPane>
              <TabPane disabled={!voting || !stf.member} tab={<Tooltip placement='top' title='Make an official vote to approve or deny.'>Vote</Tooltip>} key='5'>
                <Vote id={_id} />
              </TabPane>
              <TabPane disabled={!decisions || !stf.admin} tab={<Tooltip placement='top' title='Admins may issue a decision here.'>Decision (<em>Admin-Only</em>)</Tooltip>} key='6'>
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
