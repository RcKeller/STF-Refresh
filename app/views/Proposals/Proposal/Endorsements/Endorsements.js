import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Card } from 'antd'

import Endorse from './Endorse/Endorse'

// import styles from './Body.css'
@connect(state => ({
  proposalID: state.entities.proposal._id,
  comments: state.entities.proposal.comments,
  user: state.user,
  screen: state.screen
}))
class Endorsements extends React.Component {
  render ({ comments, user } = this.props) {
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
        <Endorse />
      </div>
    )
  }
}

Endorsements.propTypes = {
  comments: PropTypes.object
}
export default Endorsements
