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
  parent: state.entities.proposal._id,
  comments: state.entities.proposal.comments,
  user: state.user
}))
class Endorse extends React.Component {
  // Disable submit button at the beginning by running validation.
  componentDidMount () { this.props.form.validateFields() }
  handleSubmit = (e) => {
    e.preventDefault()
    let { user, parent, form } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        try {
          const body = {
            proposal: parent,
            user: user._id,
            title: 'I messed up',
            body: values.comment.body
          }
          let test1 = mutateAsync({
            url: 'http://localhost:3000/v1/comments/',
            options: { method: 'POST' },
            transform: res => ({ comment: res }),
            body: body,
            update: { comment: (prev, next) => next }
          })
          let test2 = api.post('comments', body)
          console.log('test1', test1)
          console.log('test2', test2)
          // test1()
          // test2()
          api.post('comments', body)
          message.success('Draft updated!')
        } catch (err) {
          message.error('An error occured - Draft failed to update')
          console.warn(err)
        }
      }
    })
  }

  render ({ comments, user, form } = this.props) {
    return (
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
