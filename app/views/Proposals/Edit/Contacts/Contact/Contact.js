import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, Icon, Input, Button, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

import { feedback, rules, disableSubmit } from '../../../../../util/form'
import api from '../../../../../services'
// import { getRole } from '../../../../../util/selectors'
// import { initialProposalContacts } from '../../../../../selectors'

const jss = { icon: { fontSize: 13 } }
@compose(
  connect((state, props) => ({
    proposal: state.db.proposal._id,
    contact: state.db.proposal.contacts.find(c => c.role === props.role),
    index: state.db.proposal.contacts.findIndex(c => c.role === props.role)
  }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Contact extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    api: PropTypes.object,
    role: PropTypes.string,
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
    if (contact) form.setFieldsValue(contact)
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, api, proposal, contact, role, index } = this.props
    form.validateFields((err, values) => {
      //  Create Proposal w/ budget code if valid
      if (!err) {
        const info = { proposal, role, ...values }
        const params = {
          id: contact && contact._id,
          transform: proposal => ({ proposal }),
          update: ({ proposal: (prev, next) => {
            let change = Object.assign({}, prev)
            index >= 0
            ? change.contacts[index] = next
            : change.contacts = [...change.contacts, next]
            return change
          }})
        }
        params.id
        ? api.patch('contact', info, params)
        .then(message.success(`Created contact!`))
        .catch(err => {
          message.warning(`Failed to create contact - Unexpected client error`)
          console.warn(err)
        })
        : api.post('contact', info, params)
        .then(message.success(`Updated contact!`))
        .catch(err => {
          message.warning(`Failed to update contact - Unexpected client error`)
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
        <FormItem hasFeedback={feedback(form, 'name')} >
          {form.getFieldDecorator('name', rules.required)(
            <Input prefix={<Icon type='edit' style={jss.icon} />} placeholder='Name' />
          )}
        </FormItem>
        <FormItem hasFeedback={feedback(form, 'netID')} >
          {form.getFieldDecorator('netID', rules.netID)(
            <Input prefix={<Icon type='idcard' style={jss.icon} />} placeholder='NetID' />
          )}
        </FormItem>
        <FormItem hasFeedback={feedback(form, 'title')} >
          {form.getFieldDecorator('title', rules.required)(
            <Input prefix={<Icon type='info-circle-o' style={jss.icon} />} placeholder='Title' />
          )}
        </FormItem>
        <FormItem hasFeedback={feedback(form, 'phone')} >
          {form.getFieldDecorator('phone', rules.required)(
            <Input prefix={<Icon type='phone' style={jss.icon} />} placeholder='Phone' />
          )}
        </FormItem>
        <FormItem hasFeedback={feedback(form, 'mailbox')} >
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
