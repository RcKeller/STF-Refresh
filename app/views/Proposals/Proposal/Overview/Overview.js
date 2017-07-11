import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Alert } from 'antd'

@connect(state => ({
  overview: state.db.proposal.body.overview,
  decision: state.db.proposal.decision,
  amendments: state.db.proposal.amendments
}))
class Overview extends React.Component {
  render ({ overview, decision, amendments } = this.props) {
    return (
      <section>
        {decision &&
          <Alert type={decision.approved ? 'success' : 'error'} showIcon banner
            message={`Proposal ${decision.approved ? 'Approved' : 'Rejected'}`}
            description={<span>
              <h6>Author: {decision.author.name} | {decision.date}</h6>
              <p>{decision.body}</p>
            </span>}
          />
        }
        {amendments && amendments.map((a, i) =>
          <Alert key={i} type={a.approved ? 'info' : 'error'} banner
            message={`Request for Supplemental Funding by ${a.contact.name} | DATE MISSING | (${i})`}
            description={
              <span>
                <h6>{a.title}</h6>
                <p>{a.body}</p>
              </span>
            }
            />
        )}
        <Row gutter={32}>
          <Col className='gutter-row' xs={24} md={12}>
            <h1>Overview</h1>
            <p>{overview.abstract}</p>
          </Col>
          <Col className='gutter-row' xs={24} md={12}>
            <h3>Objectives</h3>
            <p>{overview.objectives}</p>
            <h3>Core Justification</h3>
            <p>{overview.justification}</p>
          </Col>
        </Row>
        <h2>Impact</h2>
        <Row gutter={32}>
          <Col className='gutter-row' xs={24} md={8}>
            <h5><em>Academic Experience</em></h5>
            <p>{overview.impact.academic}</p>
          </Col>
          <Col className='gutter-row' xs={24} md={8}>
            <h5><em>Research Opportunities</em></h5>
            <p>{overview.impact.research}</p>
          </Col>
          <Col className='gutter-row' xs={24} md={8}>
            <h5><em>Career Development</em></h5>
            <p>{overview.impact.career}</p>
          </Col>
        </Row>
      </section>
    )
  }
}

Overview.propTypes = {
  overview: PropTypes.object,
  decision: PropTypes.object,
  amendments: PropTypes.object
}
export default Overview
