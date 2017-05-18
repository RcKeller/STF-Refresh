import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {Field, reduxForm} from 'redux-form'

import { Input } from '../../../../../../components/Form/Form'
// Working on respolving those with webpack aliases, no dice so far.

import { Row, Col, Icon } from 'antd'

const contactTypes = [
  {
    title: 'Primary Contact',
    subtitle: 'The primary lead and point-of-contact for this project.',
    prefix: 'primary'
  }, {
    title: 'Student Lead',
    subtitle: 'We recommend that there be at least one student representing a project, as STF funds are intended for student use.',
    prefix: 'student'
  }, {
    title: 'Organizational Head',
    subtitle: 'A departmental head or organization president to officiate this proposal.',
    prefix: 'organization'
  }, {
    title: 'Budget Director',
    subtitle: 'Contact for budgetary concerns and handling transfers of funds.',
    prefix: 'budget'
  }
]

import styles from './Introduction.css'
const Introduction = props => {
  const {handleSubmit, pristine, reset, submitting} = props
  return (
    <form onSubmit={handleSubmit}>
      <Row gutter={64}>
        {contactTypes.map((c, i) => (
          <Col className='gutter-row' xs={24} sm={12} md={6}>
            <h2>{c.title}</h2>
            <p className={styles['role-description']}>{c.subtitle}</p>
            <Field name={`${c.prefix}Name`} label='Name'
              component={Input} prefix={<Icon type="user" />} />
            <Field name={`${c.prefix}Netid`} label='NetID'
              component={Input} prefix={<Icon type="idcard" />} />
            <Field name={`${c.prefix}Title`} label='Title'
              component={Input} prefix={<Icon type="info-circle-o" />} />
            <Field name={`${c.prefix}Phone`} label='Phone'
              component={Input} prefix={<Icon type="phone" />} />
            <Field name={`${c.prefix}Mail`} label='Mailbox'
              component={Input} prefix={<Icon type="inbox" />} />
          </Col>
        ))}
      </Row>
    </form>
  )
}

const validate = values => {
  const errors = {}
  return errors
}
export default reduxForm({
  form: 'ProposalsCreateIntroduction',
  validate
})(Introduction)
