import React from 'react'
import PropTypes from 'prop-types'
// import { connect } from 'react-redux'

// import { Input, Switch } from '../../../../../components/Form/Form'
import { Row, Col, Icon, Alert, Form, Input, Switch } from 'antd'
const FormItem = Form.Item

/*
NOTE: Contacts are stored as an array in the DB
This is so they are not opinionated.
As such, we're preparing an array of contacts to update.
*/
const contactTypes = [
  {
    role: 'primary',
    index: 0,
    title: 'Primary Contact',
    subtitle: 'The primary lead and point-of-contact for this project.'
  }, {
    role: 'budget',
    index: 1,
    title: 'Budget Director',
    subtitle: 'Contact for budgetary concerns and handling transfers of funds.'
  }, {
    role: 'organization',
    index: 2,
    title: 'Organizational Head',
    subtitle: 'A departmental head or organization president to officiate this proposal.'
  }, {
    role: 'student',
    index: 3,
    title: 'Student Lead',
    subtitle: 'We recommend that there be at least one student representing a project, as STF funds are intended for student use.'
  }
]

const layout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
}

import styles from './Introduction.css'
class Introduction extends React.Component {
  render ({ form, proposal } = this.props) {
    //  Helper functions - these return bools for styling components based on validation
    const feedback = (field) => form.isFieldTouched(field)
    const help = (field) => (form.isFieldTouched(field) && form.getFieldError(field)) || ''

    return (
      <div>
        <h1>Proposal Data</h1>
        <FormItem label='Title' {...layout}
          hasFeedback={feedback('title')} help={help('title')}
        >
          {form.getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input your title!' }]
          })(
            <Input prefix={<Icon type='edit' />} />
          )}
        </FormItem>
        <FormItem label='Category' {...layout}
          hasFeedback={feedback('category')} help={help('category')}
        >
          {form.getFieldDecorator('category', {
            rules: [{ required: true, message: 'Select a category.' }]
          })(
            <Input prefix={<Icon type='edit' />} />
          )}
        </FormItem>
        <FormItem label='Organization' {...layout}
          hasFeedback={feedback('organization')} help={help('organization')}
        >
          {form.getFieldDecorator('organization', {
            rules: [{ required: true, message: 'Select an organization.' }]
          })(
            <Input prefix={<Icon type='edit' />} />
          )}
        </FormItem>
        <Alert type='warning'
          message={<span>
            <FormItem label='Tri-Campus' {...layout} >
              {form.getFieldDecorator('uac', { valuePropName: 'checked' })(
                // valuePropName is documented in the antd docs, that's a selector for switch vals.
                <Switch size='small' />
              )}
            </FormItem>
          </span>}
          description='
          The Universal Access Committee reviews proposals for tri-campus projects. Select this if your proposal is UAC. Most proposals are NOT - reach out to the Proposal Officer if you have any questions.'
        />
        <Row gutter={32}>
          {contactTypes.map((c, i) => (
            <Col key={i} className='gutter-row' xs={24} md={12} lg={6} >
              <h3>{c.title}</h3>
              <p className={styles['role-description']}>{c.subtitle}</p>
              <FormItem label='Name' {...layout}
                hasFeedback={feedback(`contacts[${c.index}].name`)} help={help(`contacts[${c.index}].name`)}
              >
                {form.getFieldDecorator(`contacts[${c.index}].name`, {
                  rules: [{ required: true, message: 'Name required.' }]
                })(
                  <Input prefix={<Icon type='edit' />} />
                )}
              </FormItem>
              <FormItem label='NetID' {...layout}
                hasFeedback={feedback(`contacts[${c.index}].netID`)} help={help(`contacts[${c.index}].netID`)}
              >
                {form.getFieldDecorator(`contacts[${c.index}].netID`, {
                  rules: [{ required: true, message: 'NetID required.' }]
                })(
                  <Input prefix={<Icon type='idcard' />} />
                )}
              </FormItem>
              <FormItem label='Title' {...layout}
                hasFeedback={feedback(`contacts[${c.index}].title`)} help={help(`contacts[${c.index}].title`)}
              >
                {form.getFieldDecorator(`contacts[${c.index}].title`, {
                  rules: [{ required: true, message: 'Title required.' }]
                })(
                  <Input prefix={<Icon type='info-circle-o' />} />
                )}
              </FormItem>
              <FormItem label='Phone' {...layout}
                hasFeedback={feedback(`contacts[${c.index}].phone`)} help={help(`contacts[${c.index}].phone`)}
              >
                {form.getFieldDecorator(`contacts[${c.index}].phone`, {
                  rules: [{ required: true, message: 'Name required.' }]
                })(
                  <Input prefix={<Icon type='phone' />} />
                )}
              </FormItem>
              <FormItem label='Mailbox' {...layout}
                hasFeedback={feedback(`contacts[${c.index}].mailbox`)} help={help(`contacts[${c.index}].mailbox`)}
              >
                {form.getFieldDecorator(`contacts[${c.index}].mailbox`)(
                  <Input prefix={<Icon type='inbox' />} />
                )}
              </FormItem>
            </Col>
          ))}
        </Row>
      </div>
    )
  }
}
Introduction.propTypes = {
  form: PropTypes.object.isRequired,
  proposal: PropTypes.object  // async
}
export default Introduction
