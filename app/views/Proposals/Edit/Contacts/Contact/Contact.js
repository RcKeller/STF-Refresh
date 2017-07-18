import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, Icon, Input, Button, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

import { layout, feedback, help, rules, disableSubmit } from '../../../../../util/form'
import api from '../../../../../services'

// import styles from './Body.css'
const jss = {
  icon: { fontSize: 13 }
}
@compose(
  connect(
    (state, props) => ({
      parent: state.db.proposal._id,
      contact: state.db.proposal.contacts[props.index]
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Contact extends React.Component {
  componentDidMount () {
    const { form, contact } = this.props
    if (contact) {
      form.setFieldsValue(contact)
    }
    form.validateFields()
  }
  // handleSubmit = (e) => {
  //   e.preventDefault()
  //   let { form, api, parent, contact } = this.props
  //   form.validateFields((err, values) => {
  //     if (!err) {
  //       console.log(values)
  //       values = values.contacts
  //       //  Student contacts are optional. Remove their fields if not completed.
  //       const student = 3
  //       if (!values[student] || !values[student].name || !values[student].netID) {
  //         values.splice(student, 1)
  //       }
  //       //  Iterate over each contact, setting roles as appropriate.
  //       values.forEach((contact, i) => {
  //         values.role = contactFields[i].field
  //         //  Patch contacts if they already exist. Create them otherwise.
  //         contacts[i]
  //         ? api.patch(
  //           'contact',
  //           { proposal: parent, ...values[i] },
  //           { id: contacts[i]._id }
  //         )
  //         : api.post(
  //           'contact',
  //           { proposal: parent, ...values[i] }
  //         )
  //         .then(message.success('Updated ${contactFields[i].title}!'))
  //         .catch(err => {
  //           message.warning('Failed to update ${contactFields[i].title} - Unexpected client error')
  //           console.warn(err)
  //         })
  //       })
  //     }
  //   })
  // }

  render ({ form, contact, index, role, title, subtitle } = this.props) {
    //  If this
    const requireStaff = role !== 'student' ? rules.required : null
    return (
      <Form layout='inline' onSubmit={this.handleSubmit}>
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <FormItem hasFeedback={feedback(form, 'name')} help={help(form, 'name')} >
          {form.getFieldDecorator('name', requireStaff)(
            <Input prefix={<Icon type='edit' style={jss.icon} />} placeholder='Name' />
          )}
        </FormItem>
        <FormItem hasFeedback={feedback(form, 'netID')} help={help(form, 'netID')} >
          {form.getFieldDecorator('netID', requireStaff)(
            <Input prefix={<Icon type='idcard' style={jss.icon} />} placeholder='NetID' />
          )}
        </FormItem>
        <FormItem hasFeedback={feedback(form, 'title')} help={help(form, 'title')} >
          {form.getFieldDecorator('title', requireStaff)(
            <Input prefix={<Icon type='info-circle-o' style={jss.icon} />} placeholder='Title' />
          )}
        </FormItem>
        <FormItem hasFeedback={feedback(form, 'phone')} help={help(form, 'phone')} >
          {form.getFieldDecorator('phone', requireStaff)(
            <Input prefix={<Icon type='phone' style={jss.icon} />} placeholder='Phone' />
          )}
        </FormItem>
        <FormItem hasFeedback={feedback(form, 'mailbox')} help={help(form, 'mailbox')} >
          {form.getFieldDecorator('mailbox')(
            <Input prefix={<Icon type='inbox' style={jss.icon} />} placeholder='Mailbox #' />
          )}
        </FormItem>
        <FormItem>
          <Button size='large' type='primary' width='100%' style={{width: '100%'}}
            htmlType='submit' disabled={disableSubmit(form)}
            >Update</Button>
        </FormItem>
      </Form>
    )
  }
}
/*
<h1>Contact Information</h1>
<Row gutter={32}>
  {contactFields.map((c, i) => (
    <Col key={i} className='gutter-row' xs={24} md={12} lg={6} >
      <h3>{c.title}</h3>
      <p>{c.subtitle}</p>
      <FormItem
        hasFeedback={feedback(form, 'name')}
        help={help(form, 'name')}
      >
        {form.getFieldDecorator('name', requireStaff)(
          <Input prefix={<Icon type='edit' style={jss.icon} />} placeholder='Name' />
        )}
      </FormItem>
      <FormItem
        hasFeedback={feedback(form, 'netID')}
        help={help(form, 'netID')}
      >
        {form.getFieldDecorator('netID', requireStaff)(
          <Input prefix={<Icon type='idcard' style={jss.icon} />} placeholder='NetID' />
        )}
      </FormItem>
      <FormItem
        hasFeedback={feedback(form, 'title')}
        help={help(form, 'title')}
      >
        {form.getFieldDecorator('title', requireStaff)(
          <Input prefix={<Icon type='info-circle-o' style={jss.icon} />} placeholder='Title' />
        )}
      </FormItem>
      <FormItem
        hasFeedback={feedback(form, 'phone')}
        help={help(form, 'phone')}
      >
        {form.getFieldDecorator('phone', requireStaff)(
          <Input prefix={<Icon type='phone' style={jss.icon} />} placeholder='Phone' />
        )}
      </FormItem>
      <FormItem
        hasFeedback={feedback(form, 'mailbox')}
        help={help(form, 'mailbox')}
      >
        {form.getFieldDecorator('mailbox')(
          <Input prefix={<Icon type='inbox' style={jss.icon} />} placeholder='Mailbox #' />
        )}
      </FormItem>
    </Col>
  ))}
</Row>
<FormItem>
  <Button size='large' type='primary' width='100%' style={{width: '100%'}}
    htmlType='submit' disabled={disableSubmit(form)}
    >Update</Button>
</FormItem>
*/

Contact.propTypes = {
  form: PropTypes.object,
  api: PropTypes.object,
  parent: PropTypes.string,
  contact: PropTypes.object
}
export default Contact
