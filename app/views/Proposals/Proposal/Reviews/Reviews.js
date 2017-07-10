import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Alert } from 'antd'

import Review from './Review/Review'
// import styles from './Body.css'
@connect(state => ({
  status: state.db.proposal.status,
  decision: state.db.proposal.decision,
  reviews: state.db.proposal.reviews
}))
class Reviews extends React.Component {
  render ({ status, decision, reviews } = this.props) {
    return (
      <section>
        <h1>Committee Decision</h1>
        <h6>For internal use only.</h6>
        {decision
          ? <Alert type={decision.approved ? 'success' : 'error'} showIcon
            message={`Proposal ${decision.approved ? 'Approved' : 'Rejected'} | ${decision.date}`}
            description={
              <span>
                <h6>Author: {decision.author.name}</h6>
                <p>{decision.body}</p>
              </span>
            }
            />
          : <em>No decision has been issued</em>
        }
        <h2>Reviews & Metrics</h2>
        <Row gutter={32}>
          {reviews && reviews.map((r, i) =>
            <Col key={i} className='gutter-row' xs={24} md={12} xl={8} >
              <Review index={i} />
            </Col>
          )}
        </Row>
      </section>
    )
  }
}

Reviews.propTypes = {
  reviews: PropTypes.object
}
export default Reviews
