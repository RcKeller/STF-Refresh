import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {Field, reduxForm} from 'redux-form'

import { Input, Switch } from '../../../../components/Form/Form'

import { Row, Col, Icon, Alert } from 'antd'

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
        <Col className='gutter-row' sm={24} md={12} lg={8} >
          <h2>Proposal Title</h2>
          <Field name='title' label='Proposal Title'
            component={Input} prefix={<Icon type='edit' />} />
          <h4>Category</h4>
          <Field name='category' label='Category'
            component={Input} prefix={<Icon type='folder' />} />
          <h4>Organization</h4>
          <Field name='organization' label='Organization'
            component={Input} prefix={<Icon type='team' />} />
          {/* <h4>UAC: <Field name='uac'
            component={Switch} /></h4> */}
          <Alert type='warning'
            message={<span>
              Tri-Campus / "UAC" Proposal: <Field
                name='uac' component={Switch} size='small' />
            </span>}
            description='
              The Universal Access Committee reviews proposals for tri-campus projects. Select this if your proposal is UAC. Most proposals are not UAC - reach out to the Proposal Officer if you have any questions.'
          />
        </Col>
        <Col className='gutter-row' sm={12} md={12} lg={16} >
          <Row gutter={64}>
            {contactTypes.map((c, i) => (
              <Col key={i} className='gutter-row' xs={24} sm={12} lg={6}>
                <h2>{c.title}</h2>
                <p className={styles['role-description']}>{c.subtitle}</p>
                <div>
                  <Field name={`${c.prefix}Name`} label='Name'
                    component={Input} prefix={<Icon type='user' />} />
                  <Field name={`${c.prefix}Netid`} label='NetID'
                    component={Input} prefix={<Icon type='idcard' />} />
                  <Field name={`${c.prefix}Title`} label='Title'
                    component={Input} prefix={<Icon type='info-circle-o' />} />
                  <Field name={`${c.prefix}Phone`} label='Phone'
                    component={Input} prefix={<Icon type='phone' />} />
                  <Field name={`${c.prefix}Mail`} label='Mailbox'
                    component={Input} prefix={<Icon type='inbox' />} />
                </div>
              </Col>
        ))}
          </Row>
        </Col>
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
