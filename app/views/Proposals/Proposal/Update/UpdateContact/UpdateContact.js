import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, Icon, Input, Button, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

import { feedback, help, rules, disableSubmit } from '../../../../../util/form'
import api from '../../../../../services'

const jss = { icon: { fontSize: 13 } }
@compose(
  connect(
    (state, props) => ({
      id: state.db.proposal.contacts[props.indexInStore]._id || '',
      contact: state.db.proposal.contacts[props.indexInStore],
      self: state.user.netID === state.db.proposal.contacts[props.indexInStore].netID,
      admin: (state.user.stf && state.user.stf.admin) || false
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class UpdateContact extends React.Component {
  static propTypes = {
    indexInStore: PropTypes.number,
    id: PropTypes.string,
    form: PropTypes.object,
    api: PropTypes.object,
    contact: PropTypes.object,
    self: PropTypes.bool,
    admin: PropTypes.bool
  }
  componentDidMount () {
    const { form, contact } = this.props
    if (contact) {
      form.setFieldsValue(contact)
    }
    form.validateFields()
  }
  handleContact = (e) => {
    e.preventDefault()
    let { form, api, contact, id, indexInStore } = this.props
    form.validateFields((err, values) => {
      if (!err && values) {
        const newContact = Object.assign({}, contact, values)
        const update = ({ proposal: (prev, next) => {
          let newData = Object.assign({}, prev)
          newData.contacts[indexInStore] = newContact
          return newData
        }})
        api.patch('contact', newContact, { id, update })
        .then(message.success(`Updated ${contact.role} contact!`))
        .catch(err => {
          message.warning(`Failed to update contact - Unexpected client error`)
          console.warn(err)
        })
      }
    })
  }

  render ({ form, contact, self, admin } = this.props) {
    const unAuthorized = !self && !admin
    // const unAuthorized = !self
    return (
      <Form layout='inline' onSubmit={this.handleContact}>
        <h3>{contact.role ? `${_.capitalize(contact.role)} Contact` : 'Misc Contact'}</h3>
        <FormItem hasFeedback={feedback(form, 'name')} help={help(form, 'name')} >
          {form.getFieldDecorator('name', rules.required)(
            <Input disabled={unAuthorized} prefix={<Icon type='edit' style={jss.icon} />} placeholder='Name' />
          )}
        </FormItem>
        <FormItem hasFeedback={feedback(form, 'netID')} help={help(form, 'netID')} >
          {form.getFieldDecorator('netID', rules.required)(
            <Input disabled={unAuthorized} prefix={<Icon type='idcard' style={jss.icon} />} placeholder='NetID' />
          )}
        </FormItem>
        <FormItem hasFeedback={feedback(form, 'title')} help={help(form, 'title')} >
          {form.getFieldDecorator('title', rules.required)(
            <Input disabled={unAuthorized} prefix={<Icon type='info-circle-o' style={jss.icon} />} placeholder='Title' />
          )}
        </FormItem>
        <FormItem hasFeedback={feedback(form, 'phone')} help={help(form, 'phone')} >
          {form.getFieldDecorator('phone', rules.required)(
            <Input disabled={unAuthorized} prefix={<Icon type='phone' style={jss.icon} />} placeholder='Phone' />
          )}
        </FormItem>
        <FormItem hasFeedback={feedback(form, 'mailbox')} help={help(form, 'mailbox')} >
          {form.getFieldDecorator('mailbox')(
            <Input disabled={unAuthorized} prefix={<Icon type='inbox' style={jss.icon} />} placeholder='Mailbox #' />
          )}
        </FormItem>
        <FormItem>
          <Button size='large' type='primary' width='100%' style={{width: '100%'}}
            htmlType='submit' disabled={disableSubmit(form) || unAuthorized}
            >Update</Button>
        </FormItem>
      </Form>
    )
  }
}

export default UpdateContact
