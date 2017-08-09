import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Alert, Modal, Button, Form, Input, Select, message } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
const connectForm = Form.create()

import api from '../../../../../services'

import { layout, feedback, help, rules, disableSubmit } from '../../../../../util/form'

@compose(
  connect(
    state => ({
      proposal: state.db.proposal._id,
      budget: state.db.proposal.budget,
      // supplementals: state.db.proposal.supplementals,
      contacts: state.db.proposal.contacts,
      user: state.user
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Supplemental extends React.Component {
  constructor (props) {
    super(props)
    this.state = { modal: false }
  }
  showModal = () => {
    this.setState({ modal: true })
    this.props.form.validateFields()
  }
  handleOk = () => {
    // const { form, api, user: { name, netID } } = this.props
    const { form, api, proposal, budget } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        this.setState({ confirmLoading: true })
        const { contact, title, body } = values
        let report = { proposal, budget, contact, title, body }
        console.log('Report ready to submit', report)
        //  TODO
        Promise.resolve()
        .then(() => message.success(`Supplemental Submitted! ID: ${'_ID'}`), 10)
        .then(this.setState({ modal: false, confirmLoading: false }))
      } else {
        message.warning('Failed to update - Form Invalid')
      }
    })
  }
  handleCancel = () => this.setState({ modal: false })
  render (
    { form, contacts } = this.props,
    { modal, confirmLoading } = this.state
  ) {
    return (
      <section>
        <h1>Request Supplemental</h1>
        <h6>For proposals that face an unforseen and minor increase in budgetary needs</h6>
        <p>Supplemental awards help cover common scenarios where equipment models have changed or project needs have changed slightly in comparison to an original proposal. We understand that these things happen, so supplementals requests are how you can request more funding. These are voted on by the STF committee in a separate, less intensive process.</p>
        <Alert type='info' banner showIcon={false}
          message='Important Note reg. Award Supplements'
          description='If you have underspent your award, there is no consequence - simply fill out the above budget report so we can log your spending. If your project has changed significantly, we ask that you create a new proposal instead of requesting a large supplement. By clicking "I agree", you signify that you understand these conditions.'
        />
        <Button type='primary' onClick={this.showModal}>I Agree</Button>
        <Modal visible={modal}
          title='Request an Award Supplement'
          okText='Submit Request'
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          // TODO: Add disable submit button: ...htmlType='submit' disabled={disableSubmit(form)}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem label='Point of Contact' {...layout} hasFeedback={feedback(form, 'contact')} help={help(form, 'contact')} >
              {form.getFieldDecorator('contact', rules.required)(
                <Select>
                  {contacts.map((c, i) => (
                    <Option value={c._id}>{`${c.name}, ${c.title}`}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label='Title' {...layout} hasFeedback={feedback(form, 'title')} help={help(form, 'title')} >
              {form.getFieldDecorator('title', rules.required)(
                <Input />
              )}
            </FormItem>
            <FormItem label='Body' {...layout} hasFeedback={feedback(form, 'body')} help={help(form, 'body')} >
              {form.getFieldDecorator('body', rules.required)(
                <Input type='textarea' rows={6} />
              )}
            </FormItem>
            {/* TODO - add items table */}
          </Form>
        </Modal>
      </section>
    )
  }
}

Supplemental.propTypes = {
  report: PropTypes.object
}
export default Supplemental
