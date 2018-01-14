import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, Icon, Input, AutoComplete, Checkbox, Button, Alert, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

import { layout, feedback, rules } from '../../../../util/form'
import api from '../../../../services'

@compose(
  connect(
    state => ({
      id: state.db.proposal._id,
      title: state.db.proposal.title,
      category: state.db.proposal.category,
      organization: state.db.proposal.organization,
      categories: state.config
        ? state.config.enums.categories
        : [],
      uac: state.db.proposal.uac
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Introduction extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    api: PropTypes.object,
    id: PropTypes.string,
    title: PropTypes.string,
    category: PropTypes.string,
    organization: PropTypes.string,
    uac: PropTypes.bool
  }
  componentDidMount () {
    const { form, title, category, organization, uac } = this.props
    if (title) {
      form.setFieldsValue({ title, category, organization, uac })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, api, id } = this.props
    form.validateFields((err, values) => {
      //  Create Proposal w/ budget code if valid
      if (!err) {
        const params = {
          id,
          populate: [
            'contacts', 'body',
            { path: 'manifests', populate: { path: 'items' } }
          ]
        }
        api.patch('proposal', values, params)
        .then(message.success('Introduction updated!'))
        .catch(err => {
          message.warning('Introduction failed to update - Unexpected client error')
          console.warn(err)
        })
      }
    })
  }
  // validateTitle = (title) => {
  //   return title && title.length <= 250
  // }
  validateTitle = (rule, value, callback) => {
    (value && value.length <= 100)
      ? callback()
      : callback('Titles may only be 100 characters long!')
  }

  render ({ form, categories, title, category, organization, uac } = this.props) {
    return (
      <div>
        <Alert type='info' banner
          message='Welcome to the 2017-2018 STF Proposal Application!'
          description={<span>Questions or feedback? We're here to help. E-mail the proposal officer, Katie, at <a href='mailto:STFAgent@uw.edu'>STFAgent@uw.edu</a> with any questions.</span>}
        />
        <h1>Introduction</h1>
        <Form onSubmit={this.handleSubmit}>
          <FormItem label='Title' {...layout} hasFeedback={feedback(form, 'title')}>
            {form.getFieldDecorator('title', {
              rules: [
                { required: true },
                { validator: this.validateTitle }
              ]
            })(
              <Input type='textarea' />
            )}
          </FormItem>
          <FormItem label='Category' {...layout} hasFeedback={feedback(form, 'category')}>
            {form.getFieldDecorator('category', rules.required)(
              <AutoComplete dataSource={categories} />
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
              <Checkbox />
            )}
          </FormItem>
          <FormItem>
            <Button size='large' type='primary'
              htmlType='submit'
              style={{ width: '100%' }}
              ><Icon type='cloud-upload-o' />Update</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Introduction
