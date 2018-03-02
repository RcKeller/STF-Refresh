import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, Input, Button, Card, Avatar, message } from 'antd'
const { TextArea } = Input
const { Meta } = Card
const FormItem = Form.Item
const connectForm = Form.create()

import api from '../../../../../services'
import { layout, feedback, help, rules } from '../../../../../util/form'

/*
ENDORSE COMPONENT:
Allows any logged in user to endorse a proposal
*/
// import styles from './Body.css'
@compose(
  connect(
    state => ({
      proposal: state.db.proposal._id,
      user: state.user
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Endorse extends React.Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    proposal: PropTypes.string,
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      netID: PropTypes.string.isRequired
    }).isRequired
  }
  static defaultProps = {
    proposal: '',
    user: {
      _id: '',
      name: '',
      netID: ''
    }
  }
  // Disable submit button at the beginning by running validation.
  // componentDidMount () { this.props.form.validateFields() }
  handleSubmit = (e) => {
    e.preventDefault()
    let { proposal, user, api, form } = this.props
    form.validateFields((err, values) => {
      //  Create Proposal w/ budget code if valid
      if (!err) {
        const comment = { proposal, user: user._id, ...values }
        const params = {
          populate: ['user'],
          transform: proposal => ({ proposal }),
          update: { proposal: (prev, next) => {
            let changed = Object.assign({}, prev)
            Array.isArray(changed.comments)
              ? changed.comments.push(next)
              : [next]
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
    const { _id, name, netID } = user || {}
    console.log('USER', user)
    const initials = name && name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
    return (
      <div>
        <h1>Endorse this proposal!</h1>
        <Card style={{ marginBottom: 26 }}>
          {name &&
            <Meta
              avatar={
                <Avatar size='large' style={{ backgroundColor: '#4b2e83' }}>
                  {initials}
                </Avatar>
              }
              title={`${name} (${netID})`}
            />
          }
          <Form onSubmit={this.handleSubmit}>
            <FormItem label='Comment' {...layout} hasFeedback={feedback(form, 'body')} help={help(form, 'body')} >
              {form.getFieldDecorator('body', rules.required)(
                <TextArea
                  rows={6}
                  disabled={!user.netID}
                />
              )}
            </FormItem>
            <FormItem>
              <Button size='large' type='primary'
                htmlType='submit' disabled={!user.netID}
                style={{ width: '100%' }}
              >{user ? 'Update' : 'Log In to endorse!'}</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    )
  }
}

export default Endorse
// const EndorseForm = Form.create()(Endorse)
// export default EndorseForm
