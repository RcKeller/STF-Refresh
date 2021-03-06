import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, Switch, Input, Button, Alert, message } from 'antd'
const { TextArea } = Input
const FormItem = Form.Item
const connectForm = Form.create()

import { layout } from '../../../../../util/form'
import api from '../../../../../services'
import { makeManifestByID } from '../../../../../selectors'
import { Loading } from '../../../../../components'

/*
DECISION PANEL:
Allows admins (not members) to issue a final decision
including (optional) public remarks
*/
@compose(
  connect(
    (state, props) => {
      const manifest = makeManifestByID(props.id)(state)
      const { proposal, decision } = manifest
      return {
        decision,
        manifest: manifest._id,
        proposal: proposal._id,
        author: state.user._id
      }
    },
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
    manifest: PropTypes.string,
    author: PropTypes.string
  }
  componentDidMount () {
    const { form, decision } = this.props
    if (form && decision) {
      let { body, approved } = decision
      if (!approved) approved = false
      form.setFieldsValue({ body, approved })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, api, decision, manifest, proposal, author } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const { _id: id } = decision || {}
        const submission = {
          proposal,
          manifest,
          author,
          ...values
        }
        const params = {
          id,
          transform: manifests => ({ manifests }),
          update: ({ manifests: (prev, next) => {
            let change = prev.slice()
            let manifestIndex = change.findIndex(m => m._id === manifest)
            change[manifestIndex].decision = next
            return change
          }})
        }
        params._id
          ? api.patch('decision', submission, params)
            .then(message.success('Decision updated!'))
            .catch(err => {
              message.warning('Decision failed to update - Unexpected client error')
              console.warn(err)
            })
          : api.post('decision', submission, params)
            .then(message.success('Decision posted!'))
            .catch(err => {
              message.warning('Decision failed to post - Unexpected client error')
              console.warn(err)
            })
      }
    })
  }
  render (
    { form, manifest, decision } = this.props
  ) {
    // const { decisions } = manifest.docket
    return (
      <section>
        <Loading render={manifest} title='Decision Panel'>
          <Form onSubmit={this.handleSubmit}>
            {!decision || !decision._id
              ? <Alert type='warning' showIcon banner
                message='Warning - Use AFTER Official Voting'
                description='Only admins can issue a decision, but only with committee approval. This tool was put in place to provide manual oversight to ensure that errors with the website do not cause incorrect decisions to be issued.'
              />
              : <Alert showIcon banner
                type={decision.approved ? 'success' : 'error'}
                message={`This budget was ${decision.approved ? 'approved' : 'denied'}`}
                description='You may change this value later if this was a mistake. If so, be sure to change the status of the proposal on its main page.'
              />
            }
            <FormItem label='Remarks (Public)' {...layout} >
              {form.getFieldDecorator('body')(
                <TextArea rows={4} />
              )}
            </FormItem>
            <FormItem label={<b>Decision</b>} {...layout}>
              {form.getFieldDecorator('approved', { valuePropName: 'checked' })(
                //  Valueprop is a selector for antd switches, it's in the docs.
                <Switch checkedChildren='APPROVE' unCheckedChildren='DENY' />
              )}
            </FormItem>
            <FormItem label='Submit' {...layout}>
              <Button size='large' type='primary'
                htmlType='submit' ghost
                >Issue Decision</Button>
            </FormItem>
          </Form>
        </Loading>
      </section>
    )
  }
}
export default Decision
