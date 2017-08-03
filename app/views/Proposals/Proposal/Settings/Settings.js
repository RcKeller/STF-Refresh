import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { layout } from '../../../../util/form'
import api from '../../../../services'

import { Form, Input, Select, Checkbox, Switch, Alert, message } from 'antd'
const Option = Select.Option
const FormItem = Form.Item
const connectForm = Form.create()

@compose(
  connect(
    state => ({
      id: state.db.proposal._id,
      category: state.db.proposal.category,
      organization: state.db.proposal.organization,
      budget: state.db.proposal.budget,
      uac: state.db.proposal.uac,
      status: state.db.proposal.status,
      published: state.db.proposal.published
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Settings extends React.Component {
  componentDidMount () {
    //  Take contacts, make an object with role-to-signature bool, use this to set initial vals.
    const { form, id, category, organization, budget, uac, status, published } = this.props
    if (id) {
      form.setFieldsValue({ category, organization, budget, uac, status, published })
    }
  }
  handleCategory = (category) => {
    const { api, id } = this.props
    const update = {  //  Replace publication status only.
      proposal: (prev, next) =>
        Object.assign(prev, { organization: next.category })
    }
    api.patch('proposal', { category }, { id, update })
    .then(message.success(`Updated category: ${category}`), 10)
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }
  handleOrganization = (organization) => {
    const { api, id } = this.props
    const update = {
      proposal: (prev, next) =>
        Object.assign(prev, { organization: next.organization })
    }
    api.patch('proposal', { organization }, { id, update })
    .then(message.success(`Updated organization: ${organization}`), 10)
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }
  handleBudget = (budget) => {
    const { api, id } = this.props
    const update = {
      proposal: (prev, next) =>
      Object.assign(prev, { budget: next.budget })
    }
    api.patch('proposal', { budget }, { id, update })
    .then(message.success(`Updated budget: ${budget}`), 10)
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }
  handleUAC = (uac) => {
    const { api, id } = this.props
    const update = {  //  Replace publication status only.
      proposal: (prev, next) =>
        Object.assign(prev, { uac: next.uac })
    }
    api.patch('proposal', { uac }, { id, update })
    .then(message.warning(`Proposal is now ${uac ? 'UAC' : 'Seattle-only'}!`), 10)
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }
  handleStatus = (status) => {
    const { api, id } = this.props
    const update = {
      proposal: (prev, next) =>
        Object.assign(prev, { status: next.status })
    }
    api.patch('proposal', { status }, { id, update })
    .then(message.success(`Updated status: ${status}`), 10)
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }
  handlePublished = (published) => {
    const { api, id } = this.props
    const update = {  //  Replace publication status only.
      proposal: (prev, next) =>
        Object.assign(prev, { published: next.published })
    }
    api.patch('proposal', { published }, { id, update })
    .then(message.warning(`Proposal is now ${published ? 'public' : 'private'}!`), 10)
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }
  render ({ form } = this.props) {
    return (
      <section>
        <h1>Proposal Settings</h1>
        <h6>Internal use only.</h6>
        <Alert type='warning' showIcon banner
          message='Fair Warning'
          description='Changes made here go into production immediately. Be advised that making such changes during daytime is generally poor practice. Do not tab through this section.'
        />
        <Form>
          <FormItem label='Category' {...layout} >
            {form.getFieldDecorator('category')(
              <Select onChange={this.handleCategory}>
                <Option value='a'>Placeholder A</Option>
                <Option value='b'>Placeholder B</Option>
                <Option value='c'>Placeholder C</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='Organization' {...layout} >
            {form.getFieldDecorator('organization')(
              <Select onChange={this.handleOrganization}>
                <Option value='a'>Placeholder A</Option>
                <Option value='b'>Placeholder B</Option>
                <Option value='c'>Placeholder C</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='Budget Code' {...layout} >
            {form.getFieldDecorator('budget')(
              <Input onPressEnter={(e) => this.handleBudget(e.target.value)} />
            )}
          </FormItem>
          <FormItem label='UAC / Tri-Campus' {...layout} >
            {form.getFieldDecorator('uac', { valuePropName: 'checked' })(
              <Checkbox onChange={(e) => this.handleUAC(e.target.checked)} />
            )}
          </FormItem>
          <FormItem label='Status' {...layout} >
            {form.getFieldDecorator('status')(
              <Select onChange={this.handleStatus}>
                <Option value='a'>Placeholder A</Option>
                <Option value='b'>Placeholder B</Option>
                <Option value='c'>Placeholder C</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='Published' {...layout} >
            {form.getFieldDecorator('published', { valuePropName: 'checked' })(
              <Switch onChange={(checked) => this.handlePublished(checked)} />
            )}
          </FormItem>
        </Form>
      </section>
    )
  }
}
Settings.propTypes = {
  form: PropTypes.object,
  api: PropTypes.object,
  id: PropTypes.string,
  category: PropTypes.string,
  organization: PropTypes.string,
  budget: PropTypes.string,
  uac: PropTypes.bool,
  status: PropTypes.string,
  published: PropTypes.bool
}

export default Settings
