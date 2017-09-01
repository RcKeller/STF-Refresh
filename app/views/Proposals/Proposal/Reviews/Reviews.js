import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import _ from 'lodash'

import { Row, Col, Alert, Collapse, Progress } from 'antd'
const Panel = Collapse.Panel

@connect(state => ({
  status: state.db.proposal.status,
  //  Metrics are taken for the original proposal, associated with the first manifest or "ask".
  metrics: state.db.proposal.manifests[0].reviews,
  //  Decisions are selected if an approval is there.
  manifests: state.db.proposal.manifests &&
    state.db.proposal.manifests.filter(m => m.decision)
}))
class Reviews extends React.Component {
  static propTypes = {
    reviews: PropTypes.object
  }
  render ({ status, manifests, metrics } = this.props) {
    return (
      <section>
        <h1>Committee Reviews</h1>
        <h6>For internal use only.</h6>
        <h2>Decisions</h2>
        {(manifests.length <= 0)
          ? <em>Decisions have not been issued for this proposal.</em>
          : <div>
            {manifests.map((manifest, i) => (
              <Alert key={i} type={manifest.decision.approved ? 'success' : 'warning'}
                message={`${_.capitalize(manifest.type)} Proposal ${manifest.decision.approved ? 'Approved' : 'Rejected'}`}
                description={
                  <span>
                    <h6>{`Author: ${manifest.decision.author.name} | ${manifest.decision.date.toLocaleString('en-US')}`}</h6>
                    <p>{manifest.decision.body}</p>
                  </span>
                } />
              ))}
          </div>
        }
        <h2>Metrics</h2>
        {(metrics.length <= 0)
          ? <em>Metrics have not been taken for the original budget.</em>
          : <Row gutter={32}>
            {metrics.map((review, i) => (
              <Col key={i} className='gutter-row' xs={24} md={12} xl={8} >
                <Alert type={review.approved ? 'success' : 'warning'} banner
                  message={`${review.author.name}: ${review.approved ? 'Approved' : 'Rejected'} | ${review.date.toLocaleString('en-US')}`}
                  description={
                    <div>
                      {review.body}
                      <Collapse bordered={false} style={{background: 'inherit'}}>
                        <Panel style={{border: 'none'}}header={<h6>{`Overall Score: ${review.score}%`}</h6>}>
                          {review.ratings.map((r, i) =>
                            <div key={i}>
                              <em>{r.prompt}</em>
                              <Progress percent={r.score} />
                            </div>
                          )}
                        </Panel>
                      </Collapse>
                    </div>
                  } />
              </Col>
              ))}
          </Row>
        }
      </section>
    )
  }
}

export default Reviews
