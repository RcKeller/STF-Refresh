import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, Icon, Input, Button, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

import { feedback, help, rules, disableSubmit } from '../../../../../util/form'
import api from '../../../../../services'
import { getRole } from '../../../../../util/selectors'

const jss = { icon: { fontSize: 13 } }
@compose(
  connect(
    (state, props) => ({
      parent: state.db.proposal._id,
      contact: getRole(state.db.proposal.contacts, props.role)
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Contact extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    api: PropTypes.object,
    validate: PropTypes.func,
    parent: PropTypes.string,
    contact: PropTypes.object,
    //  Props from container - REQUIRED.
    role: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string
  }
  componentDidMount () {
    const { form, contact } = this.props
    if (contact) {
      form.setFieldsValue(contact)
    }
    form.validateFields()
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, api, parent, contact, role, title, validate } = this.props
    form.validateFields((err, values) => {
      //  Patch contacts if they already exist. Create them otherwise.
      if (!err && values) {
        values.role = role  //  Set role, it's not in the form for security.
        contact
        ? api.patch(
          'contact',
          { proposal: parent, ...values },
          { id: contact._id }
        )
        : api.post(
          'contact',
          { proposal: parent, ...values }
        )
        .then(message.success(`Updated ${title} !`))
        .catch(err => {
          message.warning(`Failed to update ${title} - Unexpected client error`)
          console.warn(err)
        })
      }
    })
    // validate()
  }

  render ({ form, role, title, subtitle } = this.props) {
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

export default Contact
