import React from 'react'
import PropTypes from 'prop-types'

// import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import api from '../../../services'

// import { Collapse } from 'antd'

import styles from './Dashboard.css'
@connect(state => ({ user: state.user }))
class Dashboard extends React.Component {
  render ({ user } = this.props) {
    return (
      <article className={styles['article']}>
        Placeholder - Dashboard
        Possible tables:
        <ul>
          <li>Personal Metrics</li>
          <li>Recent decisions</li>
          <li>Decisions this quarter</li>
          <li>Upcoming proposals</li>
          <li>Extended Proposal Browser</li>
          <li>Budget / Audit information</li>
        </ul>
      </article>
    )
  }
}
Dashboard.propTypes = {
  user: PropTypes.object
}
export default Dashboard
