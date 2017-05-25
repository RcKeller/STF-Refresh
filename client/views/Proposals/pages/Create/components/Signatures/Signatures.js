import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {Field, reduxForm} from 'redux-form'

import { Input } from 'client/components/Form/Form'

import { Row, Col, Alert, Button, Icon } from 'antd'

const contactTypes = [
  {
    title: 'Primary Author',
    prefix: 'primary'
  }, {
    title: 'Organizational Head',
    prefix: 'organization'
  }, {
    title: 'Budget Director',
    prefix: 'budget'
  }
]

// import styles from './Introduction.css'
const Signatures = props => {
  const {handleSubmit, pristine, reset, submitting} = props
  return (
    <form onSubmit={handleSubmit}>
      <Row gutter={32} type="flex" justify="space-between" align="bottom">
        <Col className='gutter-row' xs={24} sm={12}>
          <h2>Final Signatures</h2>
          <p>
            To submit your proposal to the Committee, all contacts must sign this proposal signature page.
          </p>
          <p>
            By signing this proposal, a department pledges general, physical, and financial support to this proposal. Submitting a proposal also represents the department and contact's agreement with STF policies and procedures.
          </p>
        </Col>
        <Col className='gutter-row' xs={24} sm={12}>
          <Alert message='Last Step:'
            description='Send this link to the contacts listed in your proposal introduction. Ensure their NetID are spelled correctly. Each contact, with the exception of the optional student lead, will need to sign the proposal.'
            type='info' showIcon
          />
        </Col>
      </Row>
      <Row gutter={64}>
        {contactTypes.map((c, i) => (
          <Col key={i} className='gutter-row' xs={24} sm={12} md={8}>
            <h3>{c.title}</h3>
            <Button type='primary' onClick={() => console.log('Signed by', c.prefix)}>Sign Here</Button>
          </Col>
        ))}
      </Row>
      <hr />
    </form>
  )
}

const validate = values => {
  const errors = {}
  return errors
}
export default reduxForm({
  form: 'ProposalsCreateSignatures',
  validate
})(Signatures)
