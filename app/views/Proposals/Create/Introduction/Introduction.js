import React from 'react'
import PropTypes from 'prop-types'
// import { connect } from 'react-redux'

// import { Input, Switch } from '../../../../../components/Form/Form'
import { Icon, Alert, Form, Input, Switch, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option

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

const wideLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
}
const slimLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 3 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 7 } }
}

function hasErrors (fields) {
  return Object.keys(fields).some(field => fields[field])
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
        <FormItem label='Title' {...wideLayout}
          hasFeedback={feedback('title')} help={help('title')}
        >
          {form.getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input your title!' }]
          })(
            <Input prefix={<Icon type='edit' />} />
          )}
        </FormItem>
        <FormItem label='Category' {...wideLayout}
          hasFeedback={feedback('category')} help={help('category')}
        >
          {form.getFieldDecorator('category', {
            rules: [{ required: true, message: 'Select a category.' }]
          })(
            <Input prefix={<Icon type='edit' />} />
          )}
        </FormItem>
        <FormItem label='Organization' {...wideLayout}
          hasFeedback={feedback('organization')} help={help('organization')}
        >
          {form.getFieldDecorator('organization', {
            rules: [{ required: true, message: 'Select an organization.' }]
          })(
            <Input prefix={<Icon type='edit' />} />
          )}
        </FormItem>
        <Alert type='warning'
          message='Regarding Tri-Campus Proposals'
          description='
          The Universal Access Committee reviews proposals for tri-campus projects. Select this if your proposal is UAC. Most proposals are *NOT* UAC - reach out to the Proposal Officer if you have any questions.'
        />
        <FormItem label='Tri-Campus' {...wideLayout} >
          {form.getFieldDecorator('uac', { valuePropName: 'checked' })(
            <Switch size='small' />
          )}
        </FormItem>
        {contactTypes.map((c, i) => (
          <div key={i}>
            <h3>{c.title}</h3>
            <p className={styles['role-description']}>{c.subtitle}</p>
            <FormItem label='Name' {...wideLayout}
              hasFeedback={feedback(`contacts.${c.role}.name`)} help={help(`contacts.${c.role}.name`)}
            >
              {form.getFieldDecorator(`contacts.${c.role}.name`, {
                rules: [{ required: true, message: 'Name required.' }]
              })(
                <Input prefix={<Icon type='edit' />} />
              )}
            </FormItem>
            <FormItem label='NetID' {...wideLayout}
              hasFeedback={feedback(`contacts.${c.role}.netID`)} help={help(`contacts.${c.role}.netID`)}
            >
              {form.getFieldDecorator(`contacts.${c.role}.netID`, {
                rules: [{ required: true, message: 'NetID required.' }]
              })(
                <Input prefix={<Icon type='idcard' />} />
              )}
            </FormItem>
            <FormItem label='Title' {...wideLayout}
              hasFeedback={feedback(`contacts.${c.role}.title`)} help={help(`contacts.${c.role}.title`)}
            >
              {form.getFieldDecorator(`contacts.${c.role}.title`, {
                rules: [{ required: true, message: 'Title required.' }]
              })(
                <Input prefix={<Icon type='info-circle-o' />} />
              )}
            </FormItem>
            <FormItem label='Phone' {...wideLayout}
              hasFeedback={feedback(`contacts.${c.role}.phone`)} help={help(`contacts.${c.role}.phone`)}
            >
              {form.getFieldDecorator(`contacts.${c.role}.phone`, {
                rules: [{ required: true, message: 'Name required.' }]
              })(
                <Input prefix={<Icon type='phone' />} />
              )}
            </FormItem>
            {/* <FormItem label='Mailbox' {...wideLayout}
              hasFeedback={feedback(`contacts.${c.role}.mailbox`)} help={help(`contacts.${c.role}.mailbox`)}
            >
              {form.getFieldDecorator(`contacts.${c.role}.mailbox`)(
                <Input prefix={<Icon type='inbox' />} />
              )}
            </FormItem> */}
          </div>
        ))}
      </div>
    )
  }
}
Introduction.propTypes = {
  form: PropTypes.object.isRequired,
  proposal: PropTypes.object  // async
}
export default Introduction

/*

{<FormItem validateStatus='error'
      help='Oh no! Did you forget to include a title?'
    >
      <Input
        placeholder='Proposal Title'
        prefix={<Icon type='edit' />}
      />
    </FormItem>
    <h4>Category</h4>
    <Field name='category' label='Category'
      component={Input} field={<Icon type='folder' />} />
    <h4>Organization</h4>
    <Field name='organization' label='Organization'
      component={Input} field={<Icon type='team' />} />
    <Alert type='warning'
      message={<span>
        Tri-Campus / 'UAC' Proposal: <Field
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
</Row>}
*/
