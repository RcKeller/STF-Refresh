import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'
import { layout, Label } from '../../../util/form'

import { Spin, Tabs, Form, Icon, Tooltip, Input, Select, Checkbox, Switch, Alert, message } from 'antd'
const TabPane = Tabs.TabPane
const Option = Select.Option
const FormItem = Form.Item
const connectForm = Form.create()

import Membership from './Membership/Membership'

import styles from './Config.css'
// @connect(state => ({ user: state.user }))
@compose(
  connect(
    state => ({
      user: state.user,
      id: state.db.config && state.db.config._id,
      enums: state.db.config && state.db.config.enums
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  // connectRequest(api.get('blocks')),
  connectForm
)
class Config extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    api: PropTypes.object,
    id: PropTypes.string,
    status: PropTypes.string,
    submissions: PropTypes.bool,
    enums: PropTypes.shape({
      categories: PropTypes.array,
      organizations: PropTypes.object,
      questions: PropTypes.shape({
        review: PropTypes.array
      })
    })
  }
  componentDidMount () {
    const { form, enums, submissions } = this.props
    if (form && enums) {
      const { organizations, categories, questions } = enums
      const orgCodeMap = Object.keys(organizations).map(key => `${key}:${organizations[key]}`)
      form.setFieldsValue({
        submissions,
        categories,
        reviewQuestions: questions.review,
        organizations: orgCodeMap
      })
      //  BUG: Does not load if this is the landing page, how do I trigger this func as intial props come in?
    }
  }

  handleSubmissions = (submissions) => {
    const { api, id } = this.props
    console.log('sub', { submissions })
    api.patch('configs', { submissions }, { id })
    //  BUG: Why does this not patch properly?
    .then(message.warning(`Proposal submissions are now ${submissions ? 'open' : 'closed'}!`), 10)
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }

  handleOrganizations = (encodedOrgData) => {
    //  De-encode org data, transform into obj
    const organizations = {}
    for (const encoded of encodedOrgData) {
      const [org, code] = encoded.split(':')
      organizations[org] = code || ''
    }
    const { api, id } = this.props
    //  Immutability magic
    let enums = Object.assign({}, this.props.enums)
    enums.organizations = organizations
    api.patch('configs', { enums }, { id })
    .then(message.success(`Updated organizations!`), 10)
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }

  handleCategories = (categories) => {
    const { api, id } = this.props
    //  Immutability magic
    let enums = Object.assign({}, this.props.enums)
    enums.categories = categories
    api.patch('configs', { enums }, { id })
    .then(message.success(`Updated categories!`), 10)
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }

  handleQuestions = (questions) => {
    const { api, id } = this.props
    //  Immutability magic
    let enums = Object.assign({}, this.props.enums)
    enums.questions.review = questions
    api.patch('configs', { enums }, { id })
    .then(message.success(`Updated review questions!`), 10)
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }

  render ({ form, id, enums } = this.props) {
    return (
      <article className={styles['article']}>
        {!id
          ? <Spin size='large' tip='Loading...' />
          : <div id={id}>
            <h1>Web Configuration</h1>
            <h6>Here be dragons...</h6>
            <p>Here you can update various configuration settings for the website, such as opening/closing proposal submissions, editing announcements, updating the pre-selected list of campus organizations, modifying access permissions for STF members, etc.</p>
            <p>Please be advised that changes go into effect IMMEDIATELY, users will experience the change after refreshing their page.</p>
            <hr />
            <FormItem {...layout} label='Submissions'>
              {form.getFieldDecorator('submissions', { valuePropName: 'checked' })(
                <Switch onChange={this.handleSubmissions}
                  checkedChildren='Open' unCheckedChildren='Closed'
                />
              )}
            </FormItem>
            <FormItem {...layout} label={<Label title='Organizations'
              message={'This includes budget codes as well, separated by a colon. Format: <name>:<budgetcode>'} />}
            >
              {form.getFieldDecorator('organizations')(
                <Select mode='tags' placeholder='Type the name of an organization to add' onChange={this.handleOrganizations}>
                  { //  Organizations are encoded as a string map for ease of use.
                    Object.keys(enums.organizations)
                    .map(key => (
                      <Option key={`${key}:${enums.organizations[key]}`}>
                        {`${key}:${enums.organizations[key]}`}
                      </Option>
                    ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...layout} label={<Label title='Categories'
              message={'Proposal categories. Adding categories is irreversible'} />}
            >
              {form.getFieldDecorator('categories')(
                <Select mode='tags'
                  onChange={this.handleCategories}
                >
                  {enums.categories && enums.categories
                    .map(cat => (
                      <Option disabled key={cat}>{cat}</Option>
                    ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...layout} label={<Label title='Review Questions'
              message={'Add or remove review / metrics questions. These are best kept brief, without symbols.'} />}
            >
              {form.getFieldDecorator('reviewQuestions')(
                <Select mode='tags'
                  onChange={this.handleQuestions}
                >
                  {enums.questions.review && enums.questions.review
                    .map(prompt => (
                      <Option key={prompt}>{prompt}</Option>
                    ))}
                </Select>
              )}
            </FormItem>
            <Membership />
          </div>
          }
      </article>
    )
  }
}
export default Config
