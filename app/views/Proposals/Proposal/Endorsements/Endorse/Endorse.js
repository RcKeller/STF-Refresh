import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, Input, Button, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

import { layout, feedback, help, rules } from '../../../../../util/form'
import api from '../../../../../services'

// import styles from './Body.css'
@compose(
  connect(
    state => ({
      proposal: state.db.proposal._id,
      user: state.user && state.user._id
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Endorse extends React.Component {
  static propTypes = {
    proposal: PropTypes.string,
    user: PropTypes.object,
    api: PropTypes.object,
    form: PropTypes.object
  }
  // Disable submit button at the beginning by running validation.
  // componentDidMount () { this.props.form.validateFields() }
  handleSubmit = (e) => {
    e.preventDefault()
    let { proposal, user, api, form } = this.props
    form.validateFields((err, values) => {
      //  Create Proposal w/ budget code if valid
      if (!err) {
        const comment = { proposal, user, ...values }
        const params = {
          populate: ['user'],
          transform: proposal => ({ proposal }),
          update: { proposal: (prev, next) => {
            let changed = Object.assign({}, prev)
            changed.comments.push(next)
            return changed
          }}
        }
        api.post('comments', comment, params)
        .then(message.success('Endorsement posted!'))
        .catch(err => {
          message.error('An error occured - Failed to post endorsement.')
          console.warn(err)
        })
      }
    })
  }

  render ({ form, user } = this.props) {
    return (
      <div>
        <h1>Endorse this proposal!</h1>
        <Form onSubmit={this.handleSubmit}>
          <FormItem label='Comment' {...layout} hasFeedback={feedback(form, 'body')} help={help(form, 'body')} >
            {form.getFieldDecorator('body', rules.required)(
              <Input type='textarea' rows={6} disabled={!user} />
            )}
          </FormItem>
          <FormItem>
            <Button size='large' type='primary'
              htmlType='submit' disabled={!user}
              style={{ width: '100%' }}
            >{user ? 'Update' : 'Log In to endorse!'}</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Endorse
// const EndorseForm = Form.create()(Endorse)
// export default EndorseForm
