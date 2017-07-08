import React from 'react'

import { Row, Col, Alert } from 'antd'

class Update extends React.Component {
  render () {
    return (
      <section>
        <h1>Update</h1>
        <Row gutter={32}>
          <Col className='gutter-row' xs={24} md={12}>
            <p>Lorem Ipsum</p>
          </Col>
          <Col className='gutter-row' xs={24} md={12}>
            <Alert type='warning' showIcon
              message='Updates are limited'
              description='CYA stuff.'
            />
          </Col>
        </Row>
      </section>
    )
  }
}

export default Update
