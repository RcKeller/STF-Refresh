import React from 'react'
// import PropTypes from 'prop-types'
// import { connect } from 'react-redux'
import { Field } from 'redux-form'

import { Input, Switch } from '../../../../../components/Form/Form'

import { Row, Col, Icon, Alert } from 'antd'

const contactTypes = [
  {
    role: 'primary',
    title: 'Primary Contact',
    subtitle: 'The primary lead and point-of-contact for this project.'
  }, {
    role: 'budget',
    title: 'Budget Director',
    subtitle: 'Contact for budgetary concerns and handling transfers of funds.'
  }, {
    role: 'organization',
    title: 'Organizational Head',
    subtitle: 'A departmental head or organization president to officiate this proposal.'
  }, {
    role: 'student',
    title: 'Student Lead',
    subtitle: 'We recommend that there be at least one student representing a project, as STF funds are intended for student use.'
  }
]

import styles from './Introduction.css'
class Introduction extends React.Component {
  render () {
    return (
      <div>
        <Row gutter={64}>
          <Col className='gutter-row' sm={24} md={12} lg={8} >
            <h2>Proposal Title</h2>
            <Field name='title' label='Proposal Title'
              component={Input} field={<Icon type='edit' />} />
            <h4>Category</h4>
            <Field name='category' label='Category'
              component={Input} field={<Icon type='folder' />} />
            <h4>Organization</h4>
            <Field name='organization' label='Organization'
              component={Input} field={<Icon type='team' />} />
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
                    <Field name={`contacts.${c.role}.name`} label='Name'
                      component={Input} field={<Icon type='user' />} />
                    <Field name={`contacts.${c.role}.netID`} label='NetID'
                      component={Input} field={<Icon type='idcard' />} />
                    <Field name={`contacts.${c.role}.title`} label='Title'
                      component={Input} field={<Icon type='info-circle-o' />} />
                    <Field name={`contacts.${c.role}.phone`} label='Phone'
                      component={Input} field={<Icon type='phone' />} />
                    <Field name={`contacts.${c.role}.mail`} label='Mailbox'
                      component={Input} field={<Icon type='inbox' />} />
                  </div>
                </Col>
          ))}
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}
export default Introduction
