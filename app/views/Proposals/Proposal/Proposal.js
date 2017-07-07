import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'

import { Row, Col, Spin, Progress, Collapse, Icon, Tabs } from 'antd'
const Panel = Collapse.Panel
const TabPane = Tabs.TabPane

import Head from './Head/Head'
import Overview from './Overview/Overview'
import Body from './Body/Body'

const capitalize = (word) => word[0].toUpperCase() + word.substr(1)

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
    //  className={styles['article']}
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
            <TabPane tab='Test' key='2'>
              <p>Test</p>
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
