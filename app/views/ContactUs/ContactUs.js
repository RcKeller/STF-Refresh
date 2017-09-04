import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router'

import { Row, Col, Card } from 'antd'

const leadership = [
  {
    position: 'Committee Chair',
    name: 'Bryce Kolton',
    email: 'STFChair@uw.edu'
  }, {
    position: 'Proposal Officer',
    name: 'Alec Meade',
    email: 'STFAgent@uw.edu'
  }, {
    position: 'Operations & Finance',
    name: 'Rajiv Raina',
    email: 'TechFee@uw.edu'
  }, {
    position: 'Web Developer',
    name: 'Ryan Keller',
    email: 'STFCWeb@uw.edu'
  }
]

import styles from './ContactUs.css'
class ContactUs extends React.Component {
  render () {
    return (
      <article className={styles['contact']}>
        <Helmet title='Contact Us' />
        <h1>Contact Us</h1>
        <h1 className='demo-note' style={{ color: 'red' }}>CONTENT NEEDED</h1>
        <p className='demo-note' style={{ color: 'red' }}>I think this section needs either a flowchart or brief rundown of the STF admin roles. I'll need updated contact information and blurbs along the lines of "contact me for * Issue A, * Issue B", etc.</p>

        <p>
          We're here if you need us. Before reaching out, please consider learning more <Link to='/about'>about the STF</Link> first, and then viewing our <Link to='/faq'>Frequently Asked Questions</Link>. Otherwise, feel free to contact us at any of the locations below.
        </p>
        <br />
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={8}>
            <Card title='Location'>
              <ul className={styles['no-style']}>
                <li>University of Washington</li>
                <li>Husky Union Building, RM 305B</li>
                <li>4001 NE Stevens Way</li>
                <li>Seattle, WA 98195</li>
              </ul>
            </Card>
          </Col>
          {leadership.map((p, i) => (
            <Col xs={24} sm={12} lg={8}>
              <Card title={p.position}>
                <ul className={styles['no-style']}>
                  <li>{p.name}</li>
                  <li><Link to={`mailto:${p.email}`}>{p.email}</Link></li>
                </ul>
              </Card>
            </Col>
          ))}
        </Row>
      </article>
    )
  }
}

export default ContactUs
