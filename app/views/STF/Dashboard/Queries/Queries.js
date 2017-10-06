//  React and its typechecking
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
//  Redux utils
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
//  Our API services
import { layout, Label } from '../../../../util/form'
import api from '../../../../services'

import { Form, Input, Select, AutoComplete, Button, Icon, message } from 'antd'
const Option = Select.Option
const AutoCompleteOption = AutoComplete.Option
const FormItem = Form.Item
const connectForm = Form.create()

// // import the react-json-view component
// import ReactJson from 'react-json-view'
// // use the component in your app!
// <ReactJson src={my_json_object} />

//  Legible names for DB models
const modelNames = {
  'Proposals': 'proposals',
  'Project Plans': 'projects',
  'Contacts': 'contacts',
  'Budgets': 'manifests',
  'Items': 'items',
  'Endorsements': 'comments',
  'Metrics': 'reviews',
  'Decisions': 'decisions',
  'Reports': 'reports',
  'Users': 'users',
  'Blocks': 'blocks'
}
//  Joins possible per model (not necessarily comprehensive)
const modelJoins = {
  'proposals': ['body', 'contacts', 'manifests', 'comments'],
  'projects': ['proposal'],
  'contacts': ['proposal', 'block'],
  'manifests': ['proposal', 'report', 'items', 'reviews', 'decision'],
  'items': ['manifest', 'report'],
  'comments': ['proposal', 'user'],
  'reviews': ['proposal', 'manifest', 'author'],
  'decisions': ['proposal', 'manifest', 'author'],
  'reports': ['proposal', 'manifest', 'author', 'items'],
  'users': [],
  'blocks': ['contacts']
}
//  Preset, stringified JSON "WHERE" clauses for models.
/*
Department, funded, year, category
*/
const modelWhere = {
  'proposals': {
    'Published': '{"published":true}',
    'Unpublished': '{"published":true}',
    'Draft': '{"status":"Draft"}',
    'In Review': '{"status":"In Review"}',
    'Funded': '{"status":"Funded"}',
    'Partially Funded': '{"status":"Partially Funded"}',
    'Denied': '{"status":"Denied"}',
    'UAC': '{"uac":true}',
    'Fast Track': '{"fast":true}',
    'Autumn': '{"quarter":"Autumn"}',
    'Winter': '{"quarter":"Winter"}',
    'Spring': '{"quarter":"Spring"}',
    'Summer': '{"quarter":"Summer"}'
  },
  // 'projects': [],
  // 'contacts': [],
  // 'manifests': [],
  // 'items': [],
  // 'comments': [],
  // 'reviews': [],
  // 'decisions': [],
  // 'reports': [],
  // 'users': [],
  // 'blocks': []
}

//  This is a decorator, a function that wraps another class (which in JS is essentially a func)
@compose(
  connect(
    state => ({
      enums: state.config && state.config.enums,
      screen: state.screen,
      db: state.db
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Queries extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    api: PropTypes.object,
    db: PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = { model: 'proposals' }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount () {
    const { form } = this.props
    const { model } = this.state
    if (form && model) {
      form.setFieldsValue({ model })
    }
  }
  handleSelect (model) {
    this.setState({ model })
  }
  handleSubmit (e) {
    e.preventDefault()
    let { form, api } = this.props
    let { model } = this.state
    form.validateFields((err, values) => {
      if (!err) {
        //  Remove undefined:
        Object.keys(values).forEach((key) => (values[key] == null) && delete values[key])
        console.log(this.state, values)
        api.getAsync(model, {...values})
      }
    })
  }
  render (
    { form, enums, screen } = this.props,
    { model } = this.state
  ) {
    return (
      <div>
        <p>Instructions here.</p>
        <Form layout='inline' onSubmit={this.handleSubmit}>
          <FormItem label={<Label title='Model'
            message={'Models are document stores in the database - standalone records pulled together to generate site content.'} />} >
            {form.getFieldDecorator('model')(
              <Select
                style={{ width: 230 }}
                onChange={(m) => this.handleSelect(m)}
              >
                {Object.keys(modelNames).map(k => (
                  <Option key={modelNames[k]} value={modelNames[k]}>
                    <span>{k} - <em>{modelNames[k]}</em></span>
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label={<Label title='Joins'
            message={'A Join allows you to connect related documents on a shared field, usually a Universal Unique ID (UUID) that appears to be gibberish, allowing you to expand the depth of your queries.'} />}
          >
            {form.getFieldDecorator('join')(
              <Select mode='multiple' style={{ minWidth: 120 }}>
                {modelJoins[model].map(j => (
                  <Option key={j}>{j}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          {modelWhere[model] &&
            <FormItem label={<Label title='Conditions'
              message={'Also known as a "where" clause, these are preset conditions for filtering your queries, like finding published proposals. These conditions are not common and support will not extend to many models.'} />} >
              {form.getFieldDecorator('where')(
                <Select style={{ minWidth: 150 }}>
                  {Object.keys(modelWhere[model]).map(j => (
                    <Option key={j}>{j}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          }
          <FormItem>
            <Button size='large' type='primary'
              htmlType='submit' disabled={!model}
              style={{ width: '100%' }}
              ><Icon type='api' />Query</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
export default Queries
