import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Alert } from 'antd'
// import styles from './Body.css'
@connect(state => ({ report: state.entities.proposal.report }))
class Report extends React.Component {
  render ({ report } = this.props) {
    return (
      <section>
        <h1>Follow-Up Report</h1>
        <Row gutter={32}>
          <Col className='gutter-row' xs={24} md={12}>
            <p>Lorem Ipsum</p>
          </Col>
          <Col className='gutter-row' xs={24} md={12}>
            <Alert type='info' showIcon
              message='About the Reporting Process'
              description='Fill out the report, even if you underspent. If you need more money, submit an amendment to ask for supplemental funding.'
            />
          </Col>
        </Row>
      </section>
    )
  }
}

Report.propTypes = {
  report: PropTypes.object
}
export default Report
