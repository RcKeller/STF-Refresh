import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Alert, Collapse, Progress } from 'antd'
const Panel = Collapse.Panel
// import styles from './Body.css'
@connect(state => ({
  status: state.db.proposal.status,
  decision: state.db.proposal.decision,
  reviews: state.db.proposal.reviews
}))
class Review extends React.Component {
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
                <h6>Author: {decision.author}</h6>
                <p>{decision.body}</p>
              </span>
            }
            />
          : <em>No decision has been issued</em>
        }
        <hr />
        <h2>Reviews & Metrics</h2>
        {reviews && reviews.map((r, i) =>
          <Alert type={r.approved ? 'success' : 'error'} showIcon banner
            message={`${r.author}: ${decision.approved ? 'Approved' : 'Rejected'} | ${r.date}`}
            description={
              <span>
                <p>{r.body}</p>
                <Collapse bordered={false} style={{background: 'inherit'}}>
                  <Panel style={{border: 'none'}} header={<h6>Overall Score: {r.score}%</h6>}>
                    <em>{r.ratings[0].prompt}</em>
                    <Progress percent={r.ratings[0].score} />
                  </Panel>
                </Collapse>
              </span>
            }
          />
        )}
      </section>
    )
  }
}

Review.propTypes = {
  reviews: PropTypes.object
}
export default Review
