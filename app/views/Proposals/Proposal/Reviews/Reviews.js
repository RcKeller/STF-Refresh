import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Alert, Collapse, Badge } from 'antd'
const Panel = Collapse.Panel;
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
        {decision &&
          <Alert type={decision.approved ? 'success' : 'error'} showIcon
            message={`Proposal ${decision.approved ? 'Approved' : 'Rejected'} | ${decision.date}`}
            description={
              <span>
                <h6>Author: {decision.author}</h6>
                <p>{decision.body}</p>
              </span>
            }
          />
        }
        <hr />
        <h2>Reviews & Metrics</h2>
        <Collapse bordered={false}>
          {reviews && reviews.map((r, i) =>
            <Panel key={i} header={
              <Badge
                status={r.approved ? 'success' : 'error'}
                text={`${r.author}: ${decision.approved ? 'Approved' : 'Rejected'} | ${r.date}`}
             />
           }>
              <h6>Overall Score: {r.score}</h6>
              <p>{decision.body}</p>
            </Panel>
          )}
        </Collapse>
        {reviews && reviews.map((r, i) =>
          <Alert type={r.approved ? 'success' : 'error'} showIcon
            message={`${r.author}: ${decision.approved ? 'Approved' : 'Rejected'} | ${r.date}`}
            description={
              <span>
                <p>{decision.body}</p>
                <Collapse bordered={false} style={{backgroundColor: 'inherit !important'}}>
                  <Panel
                    header={<h6>Overall Score: {r.score}</h6>}>
                    Lorem Ipsum
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

/*
{reviews && reviews.map((r, i) =>
  <Alert type={r.approved ? 'success' : 'error'} showIcon
    message={`${r.author}: ${decision.approved ? 'Approved' : 'Rejected'} | ${r.date}`}
    description={
      <span>
        <h6>Overall Score: {r.score}</h6>
        <p>{decision.body}</p>
      </span>
    }
  />
)}
*/

/*
<Row gutter={32}>
  <Alert type={r.approved ? 'success' : 'error'} showIcon
    message={`${r.author}: ${decision.approved ? 'Approved' : 'Rejected'} | ${r.date}`}
    description={
      <span>
        <h6>Overall Score: {r.score}</h6>
        <p>{decision.body}</p>
      </span>
    }
  />
  <Col className='gutter-row' xs={24} md={12}>
    <h6>{r.author}</h6>
    <p>{r.body}</p>
  </Col>
  <Col className='gutter-row' xs={24} md={12}>
    <Alert type='info' showIcon
      message='About the Reviewing Process'
      description='Fill out the Review, even if you underspent. If you need more money, submit an amendment to ask for supplemental funding.'
    />
  </Col>
</Row>
*/

Reviews.propTypes = {
  reviews: PropTypes.object
}
export default Reviews
