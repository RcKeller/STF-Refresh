import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { browserHistory } from 'react-router'
import api from '../../../services'

import { layout, feedback, help, rules, disableSubmit } from '../../../util/form'

import { Modal, Button, Form, Input, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

import Agreements from './Agreements/Agreements'

import styles from './Create.css'
@compose(
  connect(
    state => ({
      user: state.user
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Create extends React.Component {
  constructor (props) {
    super(props)
    this.state = { modal: false }
  }
  showModal = () => {
    this.setState({ modal: true })
    //  Trigger required prompt, disabling submit button.
    this.props.form.validateFields()
  }
  handleOk = () => {
    this.setState({ confirmLoading: true })
    let { api, user } = this.props
    // let { cancel } = this.handleCancel
    api.post('proposal', {})
    //  TODO: Pass in user as well.
    .then(res => {
      message.success(`Proposal Created! Share the link with your team! ID: ${res.body._id}`, 10)
      browserHistory.push(`/edit/${res.body._id}`)
    })
    .catch(err => {
      message.error('An error occured - Draft failed to update')
      console.warn(err)
    })
    setTimeout(() => {
      this.setState({
        modal: false,
        confirmLoading: false
      })
    }, 2000)
  }
  handleCancel = () => {
    console.log('Clicked cancel button')
    this.setState({ modal: false })
  }
  render (
    { form } = this.props,
    { modal, confirmLoading, ModalText } = this.state
  ) {
    return (
      <article className={styles['page']}>
        <h1>Proposal Agreement</h1>
        <p>
          The Student Technology Fee Committee was created to ensure the best return on collected student dollars. By proposing to the committee, you agree to follow all requirements, current and future, set by the STFC. Included below are particularly relevant documents, along with brief summary and their full text.
        </p>
        <Agreements />
        {/* <Button size='large' type='primary'
          onClick={() => this.initializeProposal()}
        >
          I Agree<Icon type='right' />
        </Button> */}
        <Button type='primary' onClick={this.showModal}>I Agree</Button>
        <Modal title='Create a Proposal - Initial Contact Information' visible={modal}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          // TODO: Add disable submit button: ...htmlType='submit' disabled={disableSubmit(form)}
        >
          <p>Proposals are only available to users who are directly associated as a point of contact. There are four different kinds:</p>
          <ul>
            <li>Primary Contact</li>
            <li>Budget Contact</li>
            <li>Organization Head/Leader</li>
            <li>Student Lead (Optional, but highly reccommended)</li>
          </ul>
          <p>To start your proposal, you must specify your role with the project, and the associated UW budget code.</p>
          <Form onSubmit={this.handleSubmit}>
            <FormItem label='Budget' {...layout} hasFeedback={feedback(form, 'budget')} help={help(form, 'budget')} >
              {form.getFieldDecorator('budget', rules.required)(
                <Input size='small' />
              )}
            </FormItem>
            {/* TODO: Select formitem for role, modal form integration. */}
          </Form>
        </Modal>
      </article>
    )
  }
}
Create.propTypes = {
  api: PropTypes.object
}

export default Create
