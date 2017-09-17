import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

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
      id: state.config && state.config._id,
      enums: state.config && state.config.enums,
      submissions: state.config && state.config.submissions,
      news: state.config && state.config.news,
      timeline: state.config && state.config.timeline
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
    const { form, enums, submissions, news, timeline } = this.props
    if (form && enums) {
      const { organizations, categories, questions } = enums
      const orgCodeMap = Object.keys(organizations)
        .map(key => `${key}:${organizations[key]}`)
      form.setFieldsValue({
        submissions,
        news,
        timeline,
        categories,
        reviewQuestions: questions.review,
        organizations: orgCodeMap
      })
    }
  }
  handleSubmissions = (submissions) => {
    const { api, id } = this.props
    api.patch('configs', { submissions }, { id })
    .then(message.warning(`Proposal submissions are now ${submissions ? 'open' : 'closed'}!`), 10)
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }
  handleNews = (news) => {
    const { api, id } = this.props
    api.patch('configs', { news }, { id })
    .then(message.warning(`News updated!`), 10)
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }

  handleTimeline = (timeline) => {
    const { api, id } = this.props
    api.patch('configs', { timeline }, { id })
    .then(message.warning(`News updated!`), 10)
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

  render ({ router, form, id, enums } = this.props) {
    // if (!id) {
    //   message.warning('For security, the config panel cannot be a landing page.', 10)
    //   router.push('/')
    // }
    return (
      <article className={styles['article']}>
        <Helmet title='Site Config' />
        {!id
          ? <Spin size='large' tip='Loading...' />
          : <div id={id}>
            <h1>Web Configuration</h1>
            <h6>Here be dragons...</h6>
            <h1 className='demo-note' style={{ color: 'goldenrod' }}>BUG</h1>
            <p className='demo-note' style={{ color: 'goldenrod' }}>This page fails to load properly if you go directly to it, because the site loads a ton of configuration pieces over time. I am working on a fix, but the fix I need to put in requires a lot of testing, so I've put that on the back burner.</p>
            <p>Please be advised that changes go into effect IMMEDIATELY, users will experience the change after refreshing their page.</p>
            <hr />
            <FormItem {...layout} label='Submissions'>
              {form.getFieldDecorator('submissions', { valuePropName: 'checked' })(
                <Switch onChange={this.handleSubmissions}
                  checkedChildren='Open' unCheckedChildren='Closed'
                />
              )}
            </FormItem>
            <FormItem {...layout} label='News'>
              {form.getFieldDecorator('news')(
                <Input type='textarea' rows={6} onPressEnter={(e) => this.handleNews(e.target.value)} />
              )}
            </FormItem>
            <FormItem {...layout} label={<Label title='Timeline Points'
              message={'Add or remove timeline points from the frontpage. The last elementa added is shown as the pending or upcoming event..'} />}
            >
              {form.getFieldDecorator('timeline')(
                <Select mode='tags' onChange={this.handleTimeline} />
              )}
            </FormItem>
            <FormItem {...layout} label={<Label title='Organizations'
              message={'This includes budget codes as well, separated by a colon. Format: <name>:<budgetcode>'} />}
            >
              {form.getFieldDecorator('organizations')(
                <Select mode='tags' onChange={this.handleOrganizations}>
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
