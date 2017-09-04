import React from 'react'

import { Row, Col, Alert } from 'antd'

class NextSteps extends React.Component {
  render () {
    return (
      <section>
        <h1>Post-Decision F.A.Q</h1>
        <h1 className='demo-note' style={{ color: 'red' }}>CONTENT NEEDED</h1>
        <p className='demo-note' style={{ color: 'red' }}>This next-steps page should be the landing point and general reference for telling authors what comes next, and their reponsibilities post-award (update contacts, report expenditures, etc).</p>
        <p className='demo-note' style={{ color: 'red' }}>This could be a static page, OR I can add behavior to make it generate content tailored towards the proposal's state (Finished your report? It'll have audit instructions. Submitted a Supplemental request? It'll explain the Supplemental process in detail). The latter sounds fun, but we'll also have user that may potentially be frustrated by the information being unavailable prior to voting, awards, etc.</p>
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
