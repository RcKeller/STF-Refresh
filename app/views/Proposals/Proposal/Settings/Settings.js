import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { layout } from '../../../../util/form'
import api from '../../../../services'

import { Form, Input, InputNumber, Select, Checkbox, Switch, Alert, message } from 'antd'
const Option = Select.Option
const FormItem = Form.Item
const connectForm = Form.create()

/*
PROPOSAL SETTINGS TAB:
Provides functions for the admin team to manage
and make basic corrections to a proposal
Changing budget codes, proposal cycle, etc
*/
@compose(
  connect(
    state => ({
      id: state.db.proposal._id,
      category: state.db.proposal.category,
      year: state.db.proposal.year,
      number: state.db.proposal.number,
      organization: state.db.proposal.organization,
      budget: state.db.proposal.budget,
      uac: state.db.proposal.uac,
      status: state.db.proposal.status,
      published: state.db.proposal.published,
      enums: state.config.enums
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Settings extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    api: PropTypes.object,
    id: PropTypes.string,
    year: PropTypes.number,
    number: PropTypes.number,
    category: PropTypes.string,
    organization: PropTypes.string,
    budget: PropTypes.string,
    uac: PropTypes.bool,
    status: PropTypes.string,
    published: PropTypes.bool
  }
  componentDidMount () {
    //  Take contacts, make an object with role-to-signature bool, use this to set initial vals.
    const { form, id, year, number, category, organization, budget, uac, status, published } = this.props
    if (id) {
      form.setFieldsValue({ year, number, category, organization, budget, uac, status, published })
    }
  }
  handleYear = (year) => {
    const { api, id } = this.props
    const update = {
      proposal: (prev, next) =>
      Object.assign(prev, { year: next.year })
    }
    api.patch('proposal', { year }, { id, update })
    .then(message.success(`Updated year: ${year}`), 10)
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }
  handleNumber = (number) => {
    const { api, id } = this.props
    const update = {
      proposal: (prev, next) =>
      Object.assign(prev, { number: next.number })
    }
    api.patch('proposal', { number }, { id, update })
    .then(message.success(`Updated number: ${number}`), 10)
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
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
  render ({ form, enums, id } = this.props) {
    return (
      <section>
        <Alert type='warning' showIcon banner
          message='Proposal Settings'
          description={<div>
            <h6>WARNING: For major changes only.</h6>
            <p>
              Revise original content at <Link to={`/edit/${id}`}>{` https://uwstf.org/edit/${id}`}</Link>
            </p><p>
              Changes made here go into production immediately. Be advised that making such changes during daytime is generally poor practice. Do not tab through this section.'
            </p>
          </div>}
        />
        <br />
        <Form>
          <FormItem label='Year' {...layout} >
            {form.getFieldDecorator('year')(
              <InputNumber min={2000} max={2030} onChange={value => this.handleYear(value)} />
            )}
          </FormItem>
          <FormItem label='Number' {...layout} >
            {form.getFieldDecorator('number')(
              <InputNumber min={1} max={300} onChange={value => this.handleNumber(value)} />
            )}
          </FormItem>
          <FormItem label='Category' {...layout} >
            {form.getFieldDecorator('category')(
              <Select onChange={this.handleCategory}>
                {enums.categories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label='Organization' {...layout} >
            {form.getFieldDecorator('organization')(
              <Select onChange={this.handleOrganization}>
                {Object.keys(enums.organizations).map(org => (
                  <Option key={org} value={org}>{org}</Option>
                ))}
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
                {enums.statuses.map(s => (
                  <Option key={s} value={s}>{s}</Option>
                ))}
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

export default Settings
