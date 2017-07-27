import React from 'react'
import PropTypes from 'prop-types'

// import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import api from '../../../services'

// import { Collapse } from 'antd'

import styles from './Config.css'
@connect(state => ({ user: state.user }))
class Config extends React.Component {
  render ({ user } = this.props) {
    return (
      <article className={styles['article']}>
        Placeholder - Config
        <ul>
          <li>Modify announcements.</li>
          <li>Open/Close voting</li>
          <li>Edit STF committee</li>
          <li>Change Organization Types</li>
          <li>(?) Edit Q/A prompts</li>
        </ul>
      </article>
    )
  }
}
Config.propTypes = {
  user: PropTypes.object
}
export default Config
