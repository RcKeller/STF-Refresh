import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { layout } from '../../../../../util/form'
import api from '../../../../../services'

import { Spin, Form, Checkbox, Input, Button, message } from 'antd'
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
            <h1>Committee Decision</h1>
            <h6>For internal use only.</h6>
            <h4>{decisions ? 'Issue the final decision. Be forewarned, these decisions go into effect immediately!' : 'Decision submissions are closed'}</h4>
            <h1 className='demo-note' style={{ color: 'red' }}>CONTENT NEEDED</h1>
            <p className='demo-note' style={{ color: 'red' }}>A brief explaination for the next chair. The general idea behind this is that a decision would be manually issued by an authority, adding a human element to final deliberations (issuing decisions automatically has caused problems). New changes are the ability to write a blurb about the decision, although this information is not reflected in other parts of the site (we could make this a message to send to authors when we do future enhancement here)</p>
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
