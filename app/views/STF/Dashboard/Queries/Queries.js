//  React and its typechecking
import React from 'react'
import PropTypes from 'prop-types'
//  Redux utils
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
//  Our API services
import { Label } from '../../../../util/form'
import api from '../../../../services'

import { Form, Select, Button, Icon } from 'antd'
const Option = Select.Option
const FormItem = Form.Item
const connectForm = Form.create()

import ReactJson from 'react-json-view'

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
  proposals: {
    'Published': { published: true },
    'Unpublished': { published: false },
    'Draft': { status: 'Draft' },
    'In Review': { status: 'In Review' },
    'Funded': { status: 'Funded' },
    'Partially Funded': { status: 'Partially Funded' },
    'Denied': { status: 'Denied' },
    'UAC': { uac: true },
    'Fast Track': { fast: true },
    'Autumn': { quarter: 'Autumn' },
    'Winter': { quarter: 'Winter' },
    'Spring': { quarter: 'Spring' },
    'Summer': { quarter: 'Summer' }
  }
}

//  This is a decorator, a function that wraps another class (which in JS is essentially a func)
@compose(
  connect(
    state => ({
      enums: state.config && state.config.enums,
      screen: state.screen,
      querytool: state.db.querytool || {}
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
        let params = {}
        console.log(values)
        if (Array.isArray(values.join)) params.join = values.join
        if (values.where) params.where = modelWhere[model][values.where]
        params.transform = res => ({ querytool: res })
        params.update = { querytool: (prev, next) => next }
        params.force = true
        api.getAsync(model, params)
      }
    })
  }
  render (
    { form, enums, screen, querytool } = this.props,
    { model } = this.state
  ) {
    return (
      <div>
        <p>Query Tool can fetch and relate specific data from our backend based on simple conditions. For example, you can get proposals and associated contact information for anything unpublished by the query <em>proposal, contacts, unpublished</em>. This tool exists to cater for any edge cases our current BI views cannot cover for you. The script bundle for this component cannot be fetched without an administrative netID, so it should not pose a security concern.</p>
        <p>Please note, this feature is NOT a best practice for webapps. Page slowness and freezing is to be expected at this scale. An alternative would be to learn the query syntax from me and use <a href='https://www.hurl.it/'>hurl.it</a>.</p>
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
            <FormItem label={<Label title='Condition'
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
            <Button size='large' type='primary' ghost
              htmlType='submit' disabled={!model}
            >
              <Icon type='api' />Query Database
            </Button>
          </FormItem>
        </Form>
        <br />
        {window &&
          <ReactJson
            name={model}
            src={querytool}
            theme='shapeshifter:inverted'
            displayDataTypes={false}
            collapseStringsAfterLength={100}
          />
        }
      </div>
    )
  }
}
export default Queries
