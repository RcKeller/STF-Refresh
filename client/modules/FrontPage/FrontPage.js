import React from 'react'
// import { Link } from 'react-router'
// import { LinkContainer } from 'react-router-bootstrap'

import { Row, Col, Card, Alert, Timeline } from 'antd'

const images = [
  'https://photos.smugmug.com/Classroom/i-h6rZ3NP/0/469a2c2c/4K/Campus_August_2016-1576-4K.jpg',
  'https://photos.smugmug.com/Classroom/i-K9xnSdc/0/6f3bc353/4K/_DSC2708-4K.jpg',
  'https://photos.smugmug.com/Classroom/i-TD5DnHh/0/1b4c75e6/4K/Campus_72015-2001-4K.jpg'
]

import styles from './FrontPage.css'
const FrontPage = () => (
  <article>
    <Row gutter={16}>
      <Col className='gutter-row' xs={24}>
      <h1>About the STF Committee</h1>
      <p>The STF committee...</p>
    </Col>
    </Row>
    <Row gutter={16}>
      <Col className='gutter-row' xs={24} md={18}>
          <h1>Announcements</h1>
        <Row gutter={16}>
          <Col xs={24} sm={12} xl={8}>
            <Card title='Supplemental Reminder'>
                If you plan on writing a supplemental, make sure to submit it when you are finished ('Submit Supplemental' on the Edit Supplemental page). If you are have any issues or questions, please email us.
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
        <Timeline>
          <Timeline.Item color='blue'>Process A</Timeline.Item>
          <Timeline.Item color='blue'>Process B</Timeline.Item>
          <Timeline.Item color='green'>Hearing Proposals</Timeline.Item>
          <Timeline.Item color='blue'>Awards Disbursed</Timeline.Item>
        </Timeline>
      </Col>
    </Row>
  </article>
)

export default FrontPage
