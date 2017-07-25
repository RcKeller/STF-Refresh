import React from 'react'
import PropTypes from 'prop-types'

// import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import api from '../../../services'

// import { Collapse } from 'antd'

import styles from './Voting.css'
@connect(state => ({ user: state.user }))
class Voting extends React.Component {
  render ({ user } = this.props) {
    return (
      <article className={styles['article']}>
        Placeholder - Voting
        There are two kinds of meetings:
        - QA meetings (metrics, no votes)
        - Voting meetings (votes, may have metrics but probably not)
      </article>
    )
  }
}
Voting.propTypes = {
  user: PropTypes.object
}
export default Voting
