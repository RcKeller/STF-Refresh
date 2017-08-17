import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Link } from 'react-router'

import { Form, Icon, Input, Button, Alert, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

import { feedback, help, rules, disableSubmit } from '../../../../util/form'
import api from '../../../../services'
// import { getRole } from '../../../../util/selectors'

const jss = { icon: { fontSize: 13 } }

@compose(
  connect(
    state => ({
      id: state.db.proposal._id,
      date: state.db.proposal.date,
      //TODO: More specific selector, select the user
      contact: state.db.proposal.contacts[0]
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Update extends React.Component {
  componentDidMount () {
    const { form, contact } = this.props
    if (contact) {
      form.setFieldsValue(contact)
    }
    form.validateFields()
  }
  render ({ form, id, date, contact } = this.props) {
    return (
      <section>
        <h1>Post-Submission Updates</h1>
        <Alert type='warning'
          message='Grace Period'
          description={<span>
            As part of regulatory compliance, the content of a proposal cannot be edited once it undergoes review. However, since a proposal is never reviewed during the week it was submitted, we've added a one-week grace period for authors to make revisions. <Link to={`/edit/${id}`}>Click here!</Link>
          </span>}
        />
        <h2>Contact Information</h2>
        <p>Life happens and authors may not always stay involved with projects on a continuing basis. Because of this, you may appoint someone else with your same position, given you have their information.</p>
        <Form layout='inline' onSubmit={this.handleSubmit}>
          {/* <h3>{title}</h3>
          <p>{subtitle}</p> */}
          <h3>{`Update ${contact.role} contact`}</h3>
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
              >Update</Button>
          </FormItem>
        </Form>
        <Alert type='info' showIcon={false} banner
          message='Minor Edits'
          description='For typos and minor corrections, e-mail stfagent@uw.edu. For major corrections, we suggest withdrawing this proposal and re-submitting a new one.'
        />
      </section>
    )
  }
}

export default Update
