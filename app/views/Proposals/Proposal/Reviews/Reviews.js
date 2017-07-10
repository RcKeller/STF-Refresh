import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Alert } from 'antd'

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
        <hr />
        <h2>Reviews & Metrics</h2>
        {reviews && reviews.map((r, i) =>
          <Review key={i} index={i} />
        )}
      </section>
    )
  }
}

Reviews.propTypes = {
  reviews: PropTypes.object
}
export default Reviews
