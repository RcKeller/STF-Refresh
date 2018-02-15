import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../services'
import { makeManifestByID } from '../../../../selectors'

import { Col, Row, Spin, Tabs, Tooltip } from 'antd'
const TabPane = Tabs.TabPane

import Summary from './Summary/Summary'
import Endorsements from './Endorsements/Endorsements'
import Budget from './Budget/Budget'
import Scores from './Scores/Scores'
import Metrics from './Metrics/Metrics'
import Vote from './Vote/Vote'
import Decision from './Decision/Decision'

const currency = value => `$${Number.parseInt(value).toLocaleString()}`

const capitalize = (word) => word[0].toUpperCase() + word.substr(1)
/*
VOTING PANELS CONTAINER:
Renders individual views for manifests
based on what kind of meeting is being held

There are two kinds of meetings:
- QA meetings (metrics, no votes)
- Voting meetings (votes, may have metrics but probably not)
*/
@connect(
    //  Might seem counterintuitive, but we're connecting to a manifest and pulling its proposal data.
    (state, props) => {
      const manifest = makeManifestByID(props.id)(state)
      const { _id: id, type, docket, total, proposal } = manifest
      return {
        manifest,
        id,
        type,
        docket,
        total,
        proposal,
        stf: state.user.stf
      }
    },
    dispatch => ({ api: bindActionCreators(api, dispatch) })
)
class Panels extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    manifest: PropTypes.object,
    admin: PropTypes.object
  }
  render (
    { id, type, docket, total, proposal, stf } = this.props
  ) {
    const { metrics, voting, decisions } = docket
    const { _id: proposalID, title, organization, uac, year, number, date, status, comments } = proposal
    return (
      <section>
        {!proposal
          ? <Spin size='large' tip='Loading...' />
          : <div id={id} >
            <Row type='flex' justify='space-between' align='top'>
              <Col sm={24} lg={12}>
                <h1 id={id}><em>{capitalize(type)}</em> - {title}</h1>
                {uac && <h4><em>Universal Access Committee</em></h4>}
                <h3>For {organization}</h3>
                <h6 id={proposalID}>{`ID: ${year}-${number}`}</h6>
              </Col>
              <Col sm={24} lg={12} style={{ textAlign: 'right' }}>
                <h2>{currency(total)}</h2>
                <ul>
                  {date && <li>Submitted {new Date(date).toLocaleDateString('en-US')}</li>}
                  <li>{comments.length} Endorsements</li>
                  <li>Status: {status}</li>
                </ul>

              </Col>
            </Row>
            <hr />
            <Tabs defaultActiveKey='1'>
              <TabPane tab='Summary' key='1'>
                <Summary id={id} />
              </TabPane>
              <TabPane tab='Endorsements' key='2'>
                <Endorsements id={id} />
              </TabPane>
              <TabPane tab='Budget' key='3'>
                <Budget id={id} />
              </TabPane>
              <TabPane tab={<Tooltip placement='top' title='View committee votes & metrics'>Scores</Tooltip>} key='4'>
                <Scores id={id} />
              </TabPane>
              <TabPane disabled={!metrics && !voting && !decisions} tab={<Tooltip placement='top' title='Score this proposal by merits.'>Metrics</Tooltip>} key='5'>
                <Metrics id={id} />
              </TabPane>
              <TabPane disabled={!voting || !stf.member} tab={<Tooltip placement='top' title='Make an official vote to approve or deny.'>Vote (<em>Members</em>)</Tooltip>} key='6'>
                <Vote id={id} />
              </TabPane>
              <TabPane disabled={!decisions || !stf.admin} tab={<Tooltip placement='top' title='Admins may issue a decision here.'>Decision (<em>Admins</em>)</Tooltip>} key='7'>
                <Decision id={id} />
              </TabPane>
            </Tabs>
          </div>
        }
      </section>
    )
  }
}

export default Panels
