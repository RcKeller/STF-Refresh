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
import { initialProposalContacts } from '../../../../../selectors'

const jss = { icon: { fontSize: 13 } }
@compose(
  connect((state, props) => ({
    proposal: state.db.proposal._id,
    contacts: initialProposalContacts(state),
    contact: initialProposalContacts(state)[props.index]
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
    proposal: PropTypes.string,
    //  Contact is selected by its index within the redux store
    index: PropTypes.number,
    contact: PropTypes.object,
    //  Props from container (text for render).
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
    let { form, api, proposal, contact, contacts, index, title, validate } = this.props
    form.validateFields((err, values) => {
      if (!err && values) {
        //  Set role type, it's not in the form for security.
        const submission = { proposal, role: contact.role, ...values }
        /*
        NOTE: Since we're operating on state.db.proposal and need the new ID
        we transform proposal data (the res being our new/updated contact)
        and set the contact at our index to the transformed (selected) value
        */
        const transform = res => ({ proposal: res })
        const update = { proposal: (prev, next) => {
          let newData = Object.assign({}, prev)
          let contactIndex = newData.contacts.findIndex(c => c.role === contact.role)
          contactIndex >= 0
            ? newData.contacts[contactIndex] = next
            : newData.contacts.push(next)
          return newData
        }}
        contact._id
        ? api.patch('contact', submission, { id: contact._id, transform, update })
        : api.post('contact', submission, { transform, update })
        .then(() => {
          message.success(`Updated ${title} !`)
          validate()
        })
        .catch(err => {
          message.warning(`Failed to update ${title} - Unexpected client error`)
          console.warn(err)
        })
      }
    })
  }

  render ({ form, contact, title, subtitle } = this.props) {
    return (
      <Form layout='inline' onSubmit={this.handleSubmit}>
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <FormItem hasFeedback={feedback(form, 'name')} help={help(form, 'name')} >
          {form.getFieldDecorator('name', rules.required)(
            <Input prefix={<Icon type='edit' style={jss.icon} />} placeholder='Name' />
          )}
        </FormItem>
        <FormItem hasFeedback={feedback(form, 'netID')} help={help(form, 'netID')} >
          {form.getFieldDecorator('netID', rules.required)(
            <Input prefix={<Icon type='idcard' style={jss.icon} />} placeholder='NetID' />
          )}
        </FormItem>
        <FormItem hasFeedback={feedback(form, 'title')} help={help(form, 'title')} >
          {form.getFieldDecorator('title', rules.required)(
            <Input prefix={<Icon type='info-circle-o' style={jss.icon} />} placeholder='Title' />
          )}
        </FormItem>
        <FormItem hasFeedback={feedback(form, 'phone')} help={help(form, 'phone')} >
          {form.getFieldDecorator('phone', rules.required)(
            <Input prefix={<Icon type='phone' style={jss.icon} />} placeholder='Phone' />
          )}
        </FormItem>
        <FormItem hasFeedback={feedback(form, 'mailbox')} help={help(form, 'mailbox')} >
          {form.getFieldDecorator('mailbox')(
            <Input prefix={<Icon type='inbox' style={jss.icon} />} placeholder='Mailbox #' />
          )}
        </FormItem>
        <FormItem>
          <Button size='large' type='primary'
            htmlType='submit' disabled={disableSubmit(form)}
            style={{ width: '100%' }}
            ><Icon type='cloud-upload-o' />Update</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Contact
