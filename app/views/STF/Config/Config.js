import React from 'react'
import PropTypes from 'prop-types'

// import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import api from '../../../services'

import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

import styles from './Config.css'
@connect(state => ({ user: state.user }))
class Config extends React.Component {
  render ({ user } = this.props) {
    return (
      <article className={styles['article']}>
        <h1>Web Configuration</h1>
        <h6>Here be dragons.</h6>
        <Tabs tabPosition='left' size='small'>
          <TabPane tab='Overview' key='1'>
            <ul>
              <li>Modify announcements.</li>
              <li>Open/Close voting</li>
              <li>Edit STF committee</li>
              <li>Change Organization Types</li>
              <li>(?) Edit Q/A prompts</li>
            </ul>
          </TabPane>
          <TabPane tab='Announcements' key='1'>
            Create announcements
          </TabPane>
          <TabPane tab='Submissions' key='2'>
            Open/close
          </TabPane>
          <TabPane tab='Committee' key='3'>
            Modify members
          </TabPane>
          <TabPane tab='Organizations' key='4'>
            Add organization types
          </TabPane>
          <TabPane tab='Content' key='5'>
            Modify content (q.a. , prompts, tooltips etc).
          </TabPane>
        </Tabs>
      </article>
    )
  }
}
Config.propTypes = {
  user: PropTypes.object
}
export default Config
