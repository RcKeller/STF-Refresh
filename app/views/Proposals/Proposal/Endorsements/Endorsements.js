import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col } from 'antd'

// import styles from './Body.css'
@connect(state => ({
  comments: state.db.proposal.comments,
  screen: state.screen
}))
class Endorsements extends React.Component {
  render ({ comments, screen } = this.props) {
    return (
      <Row gutter={32}>
        <Col className='gutter-row' xs={24} md={12}>
          <p>Testing Endorsements</p>
        </Col>
      </Row>
    )
  }
}

Endorsements.propTypes = {
  comments: PropTypes.object,
  screen: PropTypes.object
}
export default Endorsements
