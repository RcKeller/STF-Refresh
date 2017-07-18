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
      </article>
    )
  }
}
Config.propTypes = {
  user: PropTypes.object
}
export default Config
