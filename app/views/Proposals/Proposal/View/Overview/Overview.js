import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col } from 'antd'
@connect(state => ({ overview: state.db.proposal.body.overview }))
class Overview extends React.Component {
  render ({ overview } = this.props) {
    return (
      <section>
        <Row gutter={32}>
          <Col className='gutter-row' xs={24} md={12}>
            <h1>Project Overview</h1>
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
  overview: PropTypes.object
}
export default Overview
