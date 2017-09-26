import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router'

import { Row, Col, Card, Avatar } from 'antd'

const leadership = [
  {
    position: 'Committee Chair',
    duties: 'The chair is responsible for creating STF policy, setting meeting agendas, approving official documents, managing personnel, communicating with student governments, and leading special projects.',
    name: 'Bryce Kolton',
    email: 'STFChair@uw.edu'
  }, {
    position: 'Proposal Officer',
    duties: 'The PO is responsible for advising proposal authors, reviewing proposals for completeness, and auditing previously funded proposals.',
    name: 'Alec Meade',
    email: 'STFAgent@uw.edu'
  }, {
    position: 'Operations & Finance Manager',
    duties: ' The OFM is responsible for scheduling, overseeing budgets, reviewing proposal reports, and general committee operations.',
    name: 'Rajiv Raina',
    email: 'TechFee@uw.edu'
  }, {
    position: 'Web Developer',
    duties: 'The Web Developer is is responsible for maintaining, updating, and improving upon the STF’s web resources.',
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
        <ul>
          <li>University of Washington</li>
          <li>Husky Union Building, RM 305B</li>
          <li>4001 NE Stevens Way</li>
          <li>Seattle, WA 98195</li>
        </ul>
        <br />
        <p>
          We're here if you need us. Before reaching out, please consider learning more <Link to='/about'>about the STF</Link> first, and then viewing our <Link to='/faq'>Frequently Asked Questions</Link>. Otherwise, feel free to contact us at any of us below. If in doubt, contact the chair.
        </p>
        {leadership.map((p, i) => (
          <div key={i} className={styles['contact-block']}>
            <Avatar shape='square' size='large' icon='user' />
            <div className={styles['avatar-text']}>
              <b>{p.position}</b>
              <br />
              <span>{p.name}</span>
            </div>
            <div>
            <span>Email: <a href={`mailto:${p.email}`}>{p.email}</a></span>
            <p>{p.duties}</p>
          </div>
          </div>
          // <Card key={i}
          //   title={p.position}
          //   extra={<a href={`mailto:${p.email}`}>{p.email}</a>}
          //   >
          //   <span>Current: <b>{p.name}</b></span>
          //   <p>{p.duties}</p>
          // </Card>
        ))}
      </article>
    )
  }
}

export default ContactUs
