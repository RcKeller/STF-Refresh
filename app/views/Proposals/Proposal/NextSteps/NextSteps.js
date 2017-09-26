import React from 'react'

import { Row, Col, Alert } from 'antd'

class NextSteps extends React.Component {
  render () {
    return (
      <section>
        <h1>Post-Decision F.A.Q</h1>
        <Row gutter={32}>
          <Col className='gutter-row' xs={24} md={12}>
            <p>Lorem Ipsum</p>
          </Col>
          <Col className='gutter-row' xs={24} md={12}>
            <Alert type='info' showIcon
              message='About Committee Determinations'
              description='CYA stuff.'
            />
          </Col>
        </Row>
      </section>
    )
  }
}

export default NextSteps
