import React from 'react'
import { connect } from 'react-redux'

import { Row, Col, Card, Alert, Timeline, Carousel } from 'antd'
const Item = Timeline.Item

import styles from './FrontPage.css'
@connect(state => ({
  announcements: state.db.config.announcements,
  stage: state.db.config.stage
}))
class FrontPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = { loaded: false }
  }
  componentDidMount () {
    //  BUG: The nav must slide out first in order for size to properly calculate.
    //  This timeout is a temp fix.
    setTimeout(() => this.setState({ loaded: true }), 250)
  }
  render (
    { announcements, stage } = this.props,
    { loaded } = this.state
  ) {
    return (
      <article className={styles['page']}>
        {loaded &&
          <Carousel autoplay effect='fade' >
            <div><h3>1</h3></div>
            <div><h3>2</h3></div>
            <div><h3>3</h3></div>
            <div><h3>4</h3></div>
          </Carousel>
        }
        <section className={styles['page-content']}>
          <Row gutter={16}>
            <Col className='gutter-row' xs={24}>
              <Card title='supplementalal Reminder'>
                  If you plan on writing a supplementalal, make sure to submit it when you are finished ('Submit supplementalal' on the Edit supplementalal page). If you are have any issues or questions, please email us.
              </Card>
              <Card title='supplementalal Reminder'>
                  If you plan on writing a supplementalal, make sure to submit it when you are finished ('Submit supplementalal' on the Edit supplementalal page). If you are have any issues or questions, please email us.
              </Card>
              <h1>About the STF Committee</h1>
              <p>The STF committee...</p>
              <h2>H2</h2>
              <p>The STF committee...</p>
              <h3>H3</h3>
              <p>The STF committee...</p>
              <h4>H4</h4>
              <p>The STF committee...</p>
              <h5>H5</h5>
              <p>The STF committee...</p>
              <h6>H6</h6>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className='gutter-row' xs={24} md={18}>
              <h1>Announcements</h1>
              <Row gutter={16}>
                <Col xs={24} sm={12} xl={8}>
                  <Card title='supplementalal Reminder'>
                      If you plan on writing a supplementalal, make sure to submit it when you are finished ('Submit supplementalal' on the Edit supplementalal page). If you are have any issues or questions, please email us.
                  </Card>
                </Col>
                <Col xs={24} sm={12} xl={8}>
                  <Card title='Upcoming Workshops'>
                    Workshops are a great oppurtunity to meet STF leadership, ask questions in a low-stakes setting, and craft a proposal. We are holding workshops on March 10th, 14th, and 29th. View our calendar for details.
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col className='gutter-row' xs={24} lg={6}>
              <Alert type='success'
                message='Hearing Spring Proposals'
                description='The committee is in the process of hearing Spring proposals. Please wait for an email from techfee@uw.edu detailing your proposal date.'
              />
              <section>
                <Timeline>
                  <Item color='blue'>Process A</Item>
                  <Item color='blue'>Process B</Item>
                  <Item color='green'>Hearing Proposals</Item>
                  <Item color='blue'>Awards Disbursed</Item>
                </Timeline>
              </section>
            </Col>
          </Row>
        </section>
      </article>
    )
  }
}

export default FrontPage
