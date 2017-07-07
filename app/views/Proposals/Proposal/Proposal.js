import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'

import { Spin, Tabs } from 'antd'
const TabPane = Tabs.TabPane

import Head from './Head/Head'
import Overview from './Overview/Overview'
import Body from './Body/Body'

import styles from './Proposal.css'
@compose(
  connect(state => ({
    proposal: state.db.proposal,
    screen: state.screen
  })),
  connectRequest(props => api.get('proposals', {
    where: {
      year: props.params.year,
      number: props.params.number
    },
    join: ['body', 'decision', 'contacts', 'manifests', 'report', 'amendments', 'comments']
  }))
)
class Proposal extends React.Component {
  render ({ proposal, screen } = this.props) {
    return (
      <article className={styles['article']} >
        {!proposal
          ? <Spin size='large' tip='Loading...' />
          : <Tabs className='tab-container' type='card' >
            <TabPane className={styles['tab-pane']} tab='Proposal' key='1'>
              <h1>{proposal.title}</h1>
              <h3>For {proposal.organization}</h3>
              <h6>{`ID: ${proposal.year}-${proposal.number}`}</h6>
              <Head />
              <Overview />
              <hr />
              <Body />
            </TabPane>
            <TabPane tab='Report' key='2'>
              <p>Report</p>
              <br />
              <p>Amendment submissions probably go here as a footnote.</p>
            </TabPane>
            <TabPane tab='Reviews' key='3'>
              <p>Reviews</p>
              <br />
              <p>Amendment submissions probably go here as a footnote.</p>
            </TabPane>
            <TabPane tab='Update' key='4'>
              <p>Update</p>
              <br />
              <p>User & admin tools - update contacts, withdraw, etc</p>
            </TabPane>
            <TabPane tab='Admin' key='5'>
              <p>Admin</p>
              <br />
              <p>Admin-only Tools. Withdraw, change</p>
            </TabPane>
          </Tabs>
        }
      </article>
    )
  }
}

Proposal.propTypes = {
  proposal: PropTypes.object
}
export default Proposal
