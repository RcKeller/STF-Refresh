import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Alert } from 'antd'
// import styles from './Body.css'
@connect(state => ({ report: state.db.proposal.report }))
class Reporting extends React.Component {
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
              description='Fill out the report, even if you underspent. If you need more money, submit an supplemental to ask for supplementalal funding.'
            />
          </Col>
        </Row>
      </section>
    )
  }
}

Reporting.propTypes = {
  report: PropTypes.object
}
export default Reporting
