import React from 'react'
import PropTypes from 'prop-types'

// import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import api from '../../../services'

// import { Collapse } from 'antd'

import styles from './Knowledge.css'
@connect(state => ({ user: state.user }))
class Knowledge extends React.Component {
  render ({ user } = this.props) {
    return (
      <article className={styles['article']}>
        Placeholder - Knowledge
      </article>
    )
  }
}
Knowledge.propTypes = {
  user: PropTypes.object
}
export default Knowledge
