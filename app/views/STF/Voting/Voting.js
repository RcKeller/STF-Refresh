import React from 'react'
import PropTypes from 'prop-types'

// import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import api from '../../../services'

import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

import styles from './Voting.css'
@connect(state => ({ user: state.user }))
class Voting extends React.Component {
  render ({ user } = this.props) {
    return (
      <article className={styles['article']}>
        <h1>Reviews & Voting</h1>
        <Tabs tabPosition='left'>
          <TabPane tab={<span>Proposal<br />{'2017-25'}</span>} key='1'>
            <ul>
              <li>There are two kinds of meetings:</li>
              <li>- QA meetings (metrics, no votes)</li>
              <li>- Voting meetings (votes, may have metrics but probably not)</li>
            </ul>
          </TabPane>
          <TabPane tab={<span>Partial<br />{'2017-17'}</span>} key='2'>
            Content of Tab 2
          </TabPane>
          <TabPane tab={<span>Supplemental<br />{'2017-20'}</span>} key='3'>
            Content of Tab 3
          </TabPane>
        </Tabs>
      </article>
    )
  }
}
Voting.propTypes = {
  user: PropTypes.object
}
export default Voting
