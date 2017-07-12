import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Form, Input, Button, message } from 'antd'
const FormItem = Form.Item

// function hasErrors (fields) {
//   return Object.keys(fields).some(field => fields[field])
// }

const hasErrors = (fields) => Object.keys(fields).some(field => fields[field])

const layout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
}

// import styles from './Body.css'
@connect(state => ({
  proposalID: state.db.proposal._id,
  comments: state.db.proposal.comments,
  user: state.user,
  screen: state.screen
}))
class Endorse extends React.Component {
  // Disable submit button at the beginning by running validation.
  componentDidMount () { this.props.form.validateFields() }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, proposalID, user } = this.props
    form.validateFields((err, values) => {
      console.log('SUBMITTING', err, values, proposalID, user)
    })
  }
  render (
    { comments, user, screen, getFieldsError, form } = this.props,
    { handleSubmit } = this
  ) {
    const feedback = (field) => form.isFieldTouched(field)
    const help = (field) => (form.isFieldTouched(field) && form.getFieldError(field)) || ''
    return (
      <div>
        {user &&
          <div>
            <h1>Endorse this proposal!</h1>
            <Form onSubmit={this.handleSubmit}>
              <FormItem {...layout}
                hasFeedback={feedback('comment')} help={help('body.overview.abstract')}
              >
                {form.getFieldDecorator('comment', {
                  rules: [{ required: true, message: 'Required.' }]
                })(
                  <Input type='textarea' rows={6} />
                )}
              </FormItem>
              <FormItem>
                <Button size='large' type='primary'
                  htmlType='submit'
                  disabled={hasErrors(form.getFieldsError())}
                >Update</Button>
              </FormItem>
            </Form>
          </div>
        }
      </div>
    )
  }
}
/*
<Row gutter={32}>
  <Col className='gutter-row' xs={24} md={12}>
    <p>Testing Endorsements</p>
  </Col>
</Row>
*/
Endorse.propTypes = {
  comments: PropTypes.object,
  user: PropTypes.object,
  form: PropTypes.object,
  proposalID: PropTypes.string
}
const EndorseForm = Form.create()(Endorse)
export default EndorseForm
