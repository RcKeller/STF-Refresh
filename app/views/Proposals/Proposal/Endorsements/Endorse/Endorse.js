import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, Input, Button, message } from 'antd'
const FormItem = Form.Item

import { layout, feedback, help, rules, disableSubmit } from '../../../../../util/form'
import api from '../../../../../services'

// import styles from './Body.css'
@connect(
  state => ({
    parent: state.entities.proposal._id,
    user: state.user
  }),
  dispatch => ({ api: bindActionCreators(api, dispatch) })
)
class Endorse extends React.Component {
  // Disable submit button at the beginning by running validation.
  componentDidMount () { this.props.form.validateFields() }
  handleSubmit = (e) => {
    e.preventDefault()
    let { user, parent, form, api } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        api.post('comments', {
          proposal: parent,
          user: user._id,
          ...values.comment
        }, {
          update: 'proposal.comments'
        })
        .then(message.success('Draft updated!'))
        .catch(err => {
          message.error('An error occured - Draft failed to update')
          console.warn(err)
        })
      }
    })
  }

  render ({ user, form } = this.props) {
    return (
      <div>
        <h1>Endorse this proposal!</h1>
        <Form onSubmit={this.handleSubmit}>
          <FormItem label='Title' {...layout} hasFeedback={feedback(form, 'comment.title')} help={help(form, 'comment.title')} >
            {form.getFieldDecorator('comment.title', rules.required)(
              <Input type='textarea' />
            )}
          </FormItem>
          <FormItem label='Comment' {...layout} hasFeedback={feedback(form, 'comment.body')} help={help(form, 'comment.body')} >
            {form.getFieldDecorator('comment.body', rules.required)(
              <Input type='textarea' rows={6} />
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

Endorse.propTypes = {
  parent: PropTypes.string,
  user: PropTypes.object,
  form: PropTypes.object,
  api: PropTypes.object
}
const EndorseForm = Form.create()(Endorse)
export default EndorseForm
