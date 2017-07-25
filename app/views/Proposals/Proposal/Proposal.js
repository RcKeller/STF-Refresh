import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'

import { Spin, Tabs, Badge } from 'antd'
const TabPane = Tabs.TabPane

//  Public view
import View from './View/View'

import Endorsements from './Endorsements/Endorsements'
//  Contact view
import Reporting from './Reporting/Reporting'
import NextSteps from './NextSteps/NextSteps'
import Update from './Update/Update'
//  STF Memeber and admin views
import Reviews from './Reviews/Reviews'
import Settings from './Settings/Settings'

import styles from './Proposal.css'

const style = {
  badge: {
    color: '#FFF',
    backgroundColor: '#4CAF50'  //  green 500
  }
}
/*
NOTE: Bugs can be encountered when users navigate from proposals to /edit
It's caused by data mismatches in the cached store nodes.
Added a check for publication status that tests truthiness, preventing errors.
connectRequest will force a query if there's a mismatch.
*/
@compose(
  connect(state => ({
    published: state.db.proposal && state.db.proposal.published
  })),
  connectRequest(props => api.get('proposal', {
    where: {
      year: props.params.year,
      number: props.params.number
    },
    join: ['contacts', 'decision', 'body', 'manifests', 'comments', 'supplementals', 'report', 'reviews']
  }))
)
class Proposal extends React.Component {
  render ({ proposal, published } = this.props) {
    return (
      <article className={styles['tabbed-article']} >
        {!published
          ? <Spin size='large' tip='Loading...' />
          : <Tabs className='tab-container' type='card' >
            <TabPane tab='Proposal' key='1' className={styles['tab-pane']}>
              <View />
            </TabPane>
            <TabPane tab={<Badge dot style={style.badge}>
              <span style={{paddingRight: 4}}>Endorsements </span>
            </Badge>} key='2' className={styles['tab-pane']}>
              <Endorsements />
            </TabPane>
            <TabPane tab='Reporting' key='3' className={styles['tab-pane']}>
              <Reporting />
            </TabPane>
            <TabPane tab='Next Steps' key='4' className={styles['tab-pane']}>
              <NextSteps />
            </TabPane>
            <TabPane tab='Update' key='5' className={styles['tab-pane']}>
              <Update />
            </TabPane>
            <TabPane tab={<span>Reviews (<em>STF-Only</em>)</span>} key='6' className={styles['tab-pane']}>
              <Reviews />
            </TabPane>
            <TabPane tab={<span>Settings (<em>Admin-Only</em>)</span>} key='7' className={styles['tab-pane']}>
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
