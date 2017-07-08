import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'

import { Spin, Tabs } from 'antd'
const TabPane = Tabs.TabPane

//  Public view
import View from './View/View'
//  Contact view
import Report from './Report/Report'
import NextSteps from './NextSteps/NextSteps'
import Update from './Update/Update'
//  STF Memeber and admin views
import Reviews from './Reviews/Reviews'
import Settings from './Settings/Settings'

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
    join: ['contacts', 'decision', 'body', 'manifests', 'comments', 'amendments', 'report', 'reviews']
  }))
)
class Proposal extends React.Component {
  render ({ proposal, screen } = this.props) {
    return (
      <article className={styles['tabbed-article']} >
        {!proposal
          ? <Spin size='large' tip='Loading...' />
          : <Tabs className='tab-container' type='card' >
            <TabPane tab='Proposal' key='1' className={styles['tab-pane']}>
              <View />
            </TabPane>
            <TabPane tab='Report' key='2' className={styles['tab-pane']}>
              <Report />
            </TabPane>
            <TabPane tab='Next Steps' key='3' className={styles['tab-pane']}>
              <NextSteps />
            </TabPane>
            <TabPane tab='Update' key='4' className={styles['tab-pane']}>
              <Update />
            </TabPane>
            <TabPane tab={<span>Reviews (<em>STF-Only</em>)</span>} key='5' className={styles['tab-pane']}>
              <Reviews />
            </TabPane>
            <TabPane tab={<span>Settings (<em>Admin-Only</em>)</span>} key='6' className={styles['tab-pane']}>
              <Settings />
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
