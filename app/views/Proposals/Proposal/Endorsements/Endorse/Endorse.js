import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { mutateAsync } from 'redux-query'

import { Form, Input, Button, message } from 'antd'
const FormItem = Form.Item

import { layout, feedback, help, rules, disableSubmit } from '../../../../../util/form'
import api from '../../../../../services'

// import styles from './Body.css'
@connect(state => ({
  parent: state.db.proposal._id,
  comments: state.db.proposal.comments,
  user: state.user,
  screen: state.screen
}))
class Endorse extends React.Component {
  // Disable submit button at the beginning by running validation.
  componentDidMount () { this.props.form.validateFields() }
  handleSubmit = (e) => {
    e.preventDefault()
    let { user, parent, form } = this.props
    console.log(user, parent, form, api)
    form.validateFields((err, values) => {
      console.log(err, values)
      if (!err) {
        let body = {
          proposal: parent,
          user: user._id,
          title: 'I messed up',
          body: values.comment.body
        }
        api.get('comments')
        mutateAsync(api.post('comments', body))
        message.success('Draft updated!')
      }
    })
  }
  render (
    { comments, user, screen, form } = this.props,
    { handleSubmit } = this
  ) {
    return (
      <div>
        {user &&
          <div>
            <h1>Endorse this proposal!</h1>
            <Form onSubmit={this.handleSubmit}>
              <FormItem {...layout} hasFeedback={feedback(form, 'comment.body')} help={help(form, 'comment.body')} >
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
        }
      </div>
    )
  }
}

Endorse.propTypes = {
  comments: PropTypes.object,
  user: PropTypes.object,
  form: PropTypes.object,
  parent: PropTypes.string
}
const EndorseForm = Form.create()(Endorse)
export default EndorseForm
