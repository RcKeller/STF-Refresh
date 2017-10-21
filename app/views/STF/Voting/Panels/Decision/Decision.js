import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { layout } from '../../../../../util/form'
import api from '../../../../../services'

import { Spin, Form, Checkbox, Input, Button, Alert, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

@compose(
  connect(
    (state, props) => ({
      proposal: state.db.manifests
        .find(manifest => manifest._id === props.id).proposal._id || '',
      manifest: state.db.manifests
        .find(manifest => manifest._id === props.id) || {},
      decision: state.db.manifests
        .find(manifest => manifest._id === props.id).decision || {},
      user: state.user
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Decision extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    api: PropTypes.object,
    id: PropTypes.string.isRequired,
    proposal: PropTypes.string,
    decision: PropTypes.object,
    manifest: PropTypes.object,
    review: PropTypes.object,
    user: PropTypes.object
  }
  componentDidMount () {
    const { form, decision } = this.props
    if (form && decision) {
      const { body, approved } = decision
      form.setFieldsValue({ body, approved })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, api, proposal, manifest, decision, user } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const submission = Object.assign({
          proposal,
          manifest: manifest._id,
          author: user._id
        }, values)
        //  TODO: Add custom update func
        decision._id
          ? api.patch('decision', submission, { id: decision._id })
            .then(message.success('Decision updated!'))
            .catch(err => {
              message.warning('Decision failed to update - Unexpected client error')
              console.warn(err)
            })
          : api.post('decision', submission)
            .then(message.success('Decision posted!'))
            .catch(err => {
              message.warning('Decision failed to post - Unexpected client error')
              console.warn(err)
            })
      }
    })
  }
  render (
    { form, manifest } = this.props
  ) {
    const { decisions } = manifest.docket
    return (
      <section>
        {!manifest
          ? <Spin size='large' tip='Loading...' />
          : <Form onSubmit={this.handleSubmit}>
            <Alert type='warning' showIcon banner
              message='Warning - Use AFTER Official Voting'
              description='Only admins can issue a decision, but only with committee approval. This tool was put in place to provide manual oversight to ensure that errors with the website do not cause incorrect decisions to be issued.'
            />
            <FormItem label='Remarks (Public)' {...layout} >
              {form.getFieldDecorator('body')(
                <Input disabled={!decisions}type='textarea' rows={4} />
              )}
            </FormItem>
            <FormItem label='Approved' {...layout}>
              {form.getFieldDecorator('approved', { valuePropName: 'checked' })(
                //  Valueprop is a selector for antd switches, it's in the docs.
                <Checkbox disabled={!decisions} size='large' />
              )}
            </FormItem>
            <FormItem label='Submit' {...layout}>
              <Button size='large' type='primary'
                htmlType='submit' ghost disabled={!decisions}
                >Issue Decision</Button>
            </FormItem>
          </Form>
          }
      </section>
    )
  }
}
export default Decision
