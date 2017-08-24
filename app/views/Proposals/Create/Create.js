import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { browserHistory } from 'react-router'
import api from '../../../services'

import { layout, feedback, help, rules, disableSubmit } from '../../../util/form'

import { Modal, Button, Form, Input, AutoComplete, Select, message } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
const AutoCompleteOption = AutoComplete.Option
const connectForm = Form.create()

import Agreements from './Agreements/Agreements'

import styles from './Create.css'
@compose(
  connect(
    state => ({
      user: state.user,
      organizations: (state.db.config && state.db.config.enums.organizations) || {}
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
    // const { form, api, user: { name, netID } } = this.props
    const { form, api, user } = this.props
    form.validateFields((err, values) => {
      //  Create Proposal w/ budget code if valid
      if (!err) {
        this.setState({ confirmLoading: true })
        const { organization, budget, role, title } = values
        api.post('proposal', { organization, budget })
        .then(res => {
          //  Save yourself as a new, related contact with the new proposal ID.
          const parent = res.body._id
          api.post('contact', {
            proposal: parent,
            name: user.name,
            netID: user.netID,
            role,
            title
          })
          .then(() => {
            message.success(`Proposal Created! Share the link with your team! ID: ${parent}`, 10)
            browserHistory.push(`/edit/${res.body._id}`)
          })
        })
        .catch(err => {
          message.error('An error occured - Draft failed to update')
          console.warn(err)
        })
        .then(this.setState({
          modal: false,
          confirmLoading: false
        }))
      } else {
        message.warning('Failed to update - Form Invalid')
      }
    })
  }
  handleCancel = () => {
    console.log('Clicked cancel button')
    this.setState({ modal: false })
  }
  handleOrganizationSelect = (key) => {
    const { form, organizations } = this.props
    const budget = organizations[key]
    console.log('ORG', organizations, key, budget)
    form.setFieldsValue({ budget })
  }
  render (
    { form, organizations } = this.props,
    { modal, confirmLoading, ModalText } = this.state
  ) {
    return (
      <article className={styles['page']}>
        <h1>Proposal Agreement</h1>
        <p>
          The Student Technology Fee Committee was created to ensure the best return on collected student dollars. By proposing to the committee, you agree to follow all requirements, current and future, set by the STFC. Included below are particularly relevant documents, along with brief summary and their full text.
        </p>
        <Agreements />
        <Button type='primary' onClick={this.showModal}>I Agree</Button>
        <Modal visible={modal}
          title='Create a Proposal - Initial Contact Information'
          okText='Create Proposal'
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
            <FormItem label='I am the...' {...layout} hasFeedback={feedback(form, 'role')} help={help(form, 'role')} >
              {form.getFieldDecorator('role', rules.required)(
                <Select>
                  <Option value='primary'>Primary Contact</Option>
                  <Option value='budget'>Budget Contact</Option>
                  <Option value='organization'>Org/Department Head</Option>
                  <Option value='student'>Student Lead</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label='Job Title' {...layout} hasFeedback={feedback(form, 'title')} help={help(form, 'title')} >
              {form.getFieldDecorator('title', rules.required)(
                <Input />
              )}
            </FormItem>
            <FormItem label='Organization' {...layout} hasFeedback={feedback(form, 'organization')} help={help(form, 'organization')} >
              {form.getFieldDecorator('organization', rules.required)(
                <AutoComplete onSelect={this.handleOrganizationSelect}>
                  {Object.keys(organizations).map(org => (
                    <AutoCompleteOption key={org}>
                      {`${org} - Budget ${organizations[org]}`}
                    </AutoCompleteOption>
                  ))}
                </AutoComplete>
              )}
            </FormItem>
            <FormItem label='Budget' {...layout} hasFeedback={feedback(form, 'budget')} help={help(form, 'budget')} >
              {form.getFieldDecorator('budget', rules.required)(
                <Input />
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
  form: PropTypes.object,
  api: PropTypes.object,
  user: PropTypes.object
}

export default Create
