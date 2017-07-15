import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, Input, Switch, Button, Alert, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

import { layout, feedback, help, rules, disableSubmit } from '../../../../util/form'
import api from '../../../../services'

@compose(
  connect(
    state => ({
      parent: state.db.proposal._id,
      title: state.db.proposal.title,
      category: state.db.proposal.category,
      organization: state.db.proposal.organization,
      uac: state.db.proposal.uac
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Introduction extends React.Component {
  componentDidUpdate (prevProps, prevState) {
    //  Load fields from server
    console.log('REACHED UPDATE')
    if (!prevProps.parent && this.props.parent) {
      const { title, category, organization, uac } = this.props
      console.log(...[title, category, organization, uac])
      this.props.form.setFieldsValue(...[title, category, organization, uac])
      //  Run validation, disabling submit buttons
      this.props.form.validateFields()
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, api, parent } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        api.patch('proposal',
          { proposal: parent, ...values },
          { id: parent }
        )
        .then(message.success('Introduction updated!'))
        .catch(err => {
          message.warning('Introduction failed to update - Unexpected client error')
          console.warn(err)
        })
      }
    })
  }

  render ({ form, title, category, organization, uac } = this.props) {
    return (
      <div>
        <h1>Introduction</h1>
        <Form onSubmit={this.handleSubmit}>
          <FormItem label='Title' {...layout} hasFeedback={feedback(form, 'title')} help={help(form, 'title')} >
            {form.getFieldDecorator('title', rules.required)(
              <Input type='textarea' />
            )}
          </FormItem>
          <FormItem label='Category' {...layout} hasFeedback={feedback(form, 'category')} help={help(form, 'category')} >
            {form.getFieldDecorator('category', rules.required)(
              <Input />
            )}
          </FormItem>
          <FormItem label='Organization' {...layout} hasFeedback={feedback(form, 'organization')} help={help(form, 'organization')} >
            {form.getFieldDecorator('organization', rules.required)(
              <Input />
            )}
          </FormItem>
          <Alert type='warning'
            message='Tri-Campus Proposals'
            description='
            The Universal Access Committee reviews proposals for tri-campus projects. Select this if your proposal has been reviewed by an officer and approved as a tri-campus service. Please reach out to the Proposal Officer if you have any questions.'
          />
          <FormItem label='Universal Access' {...layout} >
            {form.getFieldDecorator('uac', { valuePropName: 'checked' })(
              // valuePropName is documented in the antd docs, that's a selector for switch vals.
              <Switch size='small' />
            )}
          </FormItem>
          <FormItem>
            <Button size='large' type='primary'
              htmlType='submit' disabled={disableSubmit(form)}
              >Update</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

Introduction.propTypes = {
  form: PropTypes.object,
  api: PropTypes.object,
  parent: PropTypes.string,
  title: PropTypes.string,
  category: PropTypes.string,
  organization: PropTypes.string,
  uac: PropTypes.boolean
}
export default Introduction
