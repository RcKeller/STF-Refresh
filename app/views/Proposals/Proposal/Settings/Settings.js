import React from 'react'

import { Row, Col, Alert } from 'antd'

class Settings extends React.Component {
  render () {
    return (
      <section>
        <h1>Proposal Settings</h1>
        <Row gutter={32}>
          <Col className='gutter-row' xs={24} md={12}>
            <p>Lorem Ipsum</p>
          </Col>
          <Col className='gutter-row' xs={24} md={12}>
            <Alert type='warning' showIcon
              message='Warning'
              description='CYA stuff.'
            />
          </Col>
        </Row>
      </section>
    )
  }
}

export default Settings
