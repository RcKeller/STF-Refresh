import React from 'react'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { layout, feedback, help, rules, disableSubmit } from '../../../../util/form'
import api from '../../../../services'

import { Form, Input, Checkbox, Switch, Button, Alert, message } from 'antd'
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
    const { form, id, published, budget } = this.props
    if (id) {
      let fields = { published, budget }
      form.setFieldsValue(fields)
    }
  }
  handleBudget = (budget) => {
    console.log('Budget?', budget)
    // let { api, id } = this.props
    // api.patch('proposal', { budget }, { id })
    // .then(console.log('Updated budget', budget))
    // .catch(err => {
    //   message.warning(`Failed to update - client error`)
    //   console.warn(err)
    // })
  }
  handlePublished = (published) => {
    console.log('Published?', published)
    let { api, id } = this.props
    api.patch('proposal', { published }, { id })
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
        Change Status Indicator
        Change Budget Code
        Change org/category?
        Withdraw from publication
        <Form>
          <FormItem {...layout} label='Budget'>
            {form.getFieldDecorator('budget')(
              <Input onChange={(e) => this.handleBudget(e.target.value)} />
            )}
          </FormItem>
          <FormItem {...layout} label='Published'>
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
