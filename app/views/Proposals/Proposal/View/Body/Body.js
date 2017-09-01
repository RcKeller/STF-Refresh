import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Icon } from 'antd'

import styles from './Body.css'
@connect(state => ({
  plan: state.db.proposal.body.plan,
  screen: state.screen
}))
class Body extends React.Component {
  static propTypes = {
    body: PropTypes.object,
    screen: PropTypes.object
  }
  render ({ legacy, plan, screen } = this.props) {
    return (
      <div>
        <h1>Project Plan</h1>
        <section>
          <h2>State Analysis</h2>
          <Row gutter={32}>
            <Col className='gutter-row' xs={24} md={11}>
              <h5><em>Current State</em></h5>
              <p>{plan.state.current}</p>
            </Col>
            <Col className='gutter-row' xs={24} md={2}>
              <Icon type={screen.greaterThan.medium ? 'right' : 'down'} className={styles['arrow']} />
            </Col>
            <Col className='gutter-row' xs={24} md={11}>
              <h5><em>Future State</em></h5>
              <p>{plan.state.future}</p>
            </Col>
          </Row>
        </section>
        <section>
          <h2>Availability</h2>
          <Row gutter={32}>
            <Col className='gutter-row' xs={24} md={11}>
              <h5><em>Current Availability</em></h5>
              <p>{plan.state.current}</p>
            </Col>
            <Col className='gutter-row' xs={24} md={2}>
              <Icon type={screen.greaterThan.medium ? 'right' : 'down'} className={styles['arrow']} />
            </Col>
            <Col className='gutter-row' xs={24} md={11}>
              <h5><em>Future Availability</em></h5>
              <p>{plan.state.future}</p>
            </Col>
          </Row>
        </section>
        <section>
          <h2>Implementation Strategy</h2>
          <Row gutter={32}>
            <Col className='gutter-row' xs={24} md={11}>
              <h5><em>Organizational Backing</em></h5>
              <p>{plan.state.current}</p>
            </Col>
            <Col className='gutter-row' xs={24} md={2}>
              <Icon type={screen.greaterThan.medium ? 'right' : 'down'} className={styles['arrow']} />
            </Col>
            <Col className='gutter-row' xs={24} md={11}>
              <h5><em>Implementation Plan</em></h5>
              <p>{plan.state.future}</p>
            </Col>
          </Row>
        </section>
        <section>
          <h2>Outreach Efforts</h2>
          <Row gutter={32}>
            <Col className='gutter-row' xs={24} md={11}>
              <h5><em>Prior Outreach</em></h5>
              <p>{plan.state.current}</p>
            </Col>
            <Col className='gutter-row' xs={24} md={2}>
              <Icon type={screen.greaterThan.medium ? 'right' : 'down'} className={styles['arrow']} />
            </Col>
            <Col className='gutter-row' xs={24} md={11}>
              <h5><em>Outreach Strategy</em></h5>
              <p>{plan.state.future}</p>
            </Col>
          </Row>
        </section>
        <section>
          <h2>Risk Assessment</h2>
          <Row gutter={32}>
            <Col className='gutter-row' xs={24} md={11}>
              <h5><em>Risk Factors</em></h5>
              <p>{plan.state.current}</p>
            </Col>
            <Col className='gutter-row' xs={24} md={2}>
              <Icon type={screen.greaterThan.medium ? 'right' : 'down'} className={styles['arrow']} />
            </Col>
            <Col className='gutter-row' xs={24} md={11}>
              <h5><em>Mitigation Strategy</em></h5>
              <p>{plan.state.future}</p>
            </Col>
          </Row>
        </section>
      </div>
    )
  }
}
export default Body
