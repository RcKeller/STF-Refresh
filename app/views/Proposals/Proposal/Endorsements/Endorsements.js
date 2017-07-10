import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Card, Avatar } from 'antd'

// import styles from './Body.css'
@connect(state => ({
  comments: state.db.proposal.comments,
  screen: state.screen
}))
class Endorsements extends React.Component {
  render ({ comments, screen } = this.props) {
    return (
      <div>
        <Row gutter={32}>
          {comments.map((c, i) =>
            <Col key={i} className='gutter-row' xs={24} md={12} xl={8} >
              <Card key={i} title={<h2>{c.user.name ? c.user.name : 'Endorsement'}</h2>}
                extra={c.user.netID}
              >
                <h4>{c.title}</h4>
                <p>{c.body}</p>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    )
  }
}
/*
<Row gutter={32}>
  <Col className='gutter-row' xs={24} md={12}>
    <p>Testing Endorsements</p>
  </Col>
</Row>
*/
Endorsements.propTypes = {
  comments: PropTypes.object,
  screen: PropTypes.object
}
export default Endorsements
