import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router'

import { Avatar } from 'antd'

const leadership = [
  {
    position: 'Committee Chair',
    duties: 'The chair is responsible for creating STF policy, setting meeting agendas, approving official documents, managing personnel, communicating with student governments, and leading special projects.',
    name: 'Alec Meade',
    email: 'STFChair@uw.edu'
  }, {
    position: 'Proposal Officer',
    duties: 'The PO is responsible for advising proposal authors, reviewing proposals for completeness, and auditing previously funded proposals.',
    name: 'Katie McConville',
    email: 'STFAgent@uw.edu'
  }, {
    position: 'Operations & Finance Manager',
    duties: ' The OFM is responsible for scheduling, overseeing budgets, reviewing proposal reports, and general committee operations.',
    name: 'Britt Carlson',
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
          <div key={i}>
            <Avatar shape='square' size='large' icon='user' />
            <div className={styles['avatar-text']}>
              <b>{p.position} | <em>{p.name}</em></b>
              <br />
              <a href={`mailto:${p.email}`}>{p.email}</a>
            </div>
            <p className={styles['duties']}>{p.duties}</p>
          </div>
        ))}
      </article>
    )
  }
}

export default ContactUs
