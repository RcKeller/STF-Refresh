import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { layout } from '../../../../util/form'
import api from '../../../../services'

import { Form, Input, Select, Checkbox, Switch, Button, Alert, message } from 'antd'
const Option = Select.Option
const FormItem = Form.Item
const connectForm = Form.create()

@compose(
  connect(
    state => ({
      id: state.db.proposal._id,
      published: state.db.proposal.published,
      budget: state.db.proposal.budget,
      category: state.db.proposal.category,
      organization: state.db.proposal.organization,
      uac: state.db.proposal.uac
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Settings extends React.Component {
  componentDidMount () {
    //  Take contacts, make an object with role-to-signature bool, use this to set initial vals.
    const { form, id, published, budget, status, category, organization } = this.props
    if (id) {
      let fields = { published, budget, status, category, organization }
      form.setFieldsValue(fields)
    }
  }
  handleCategory = (category) => {
    console.log('Category?', category)
  }
  handleOrganization = (organization) => {
    console.log('Organization?', organization)
  }
  handleStatus = (status) => {
    console.log('Status?', status)
  }
  handleBudget = (budget) => {
    console.log('Budget?', budget)
    const { api, id } = this.props
    const update = {  //  Replace publication status only.
      proposal: (prev, next) =>
        Object.assign(prev, { budget: next.budget })
    }
    api.patch('proposal', { budget }, { id, update })
    .then(console.log('Updated budget:', budget))
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }
  handlePublished = (published) => {
    console.log('Published?', published)
    const { api, id } = this.props
    // api.patch('proposal', { published }, { id })
    const update = {  //  Replace publication status only.
      proposal: (prev, next) =>
        Object.assign(prev, { published: next.published })
    }
    api.patch('proposal', { published }, { id, update })
    .then(message.warning(`Proposal is now ${published ? 'public' : 'private'}!`))
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
        <p>Warnings and such.</p>
        <Alert type='warning' showIcon banner
          message='Fair Warning'
          description='Changes made here go into production immediately. Be advised that making such changes during daytime is generally poor practice. Do not tab through this section.'
        />
        <Form>
          <FormItem label='Status' {...layout} >
            {form.getFieldDecorator('status')(
              <Select onChange={this.handleStatus}>
                <Option value='a'>Placeholder A</Option>
                <Option value='b'>Placeholder B</Option>
                <Option value='c'>Placeholder C</Option>
              </Select>
            )}
          </FormItem>
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
  api: PropTypes.object,
  id: PropTypes.string,
  budget: PropTypes.string,
  uac: PropTypes.bool,
  category: PropTypes.string,
  organization: PropTypes.string,
  published: PropTypes.bool
}

export default Settings
