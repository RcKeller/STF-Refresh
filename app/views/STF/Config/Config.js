import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import api from '../../../services'
import { updateConfig } from '../../../services/config'
import { Loading } from '../../../components'
import { layout, Label } from '../../../util/form'

import { Form, Input, InputNumber, Select, Switch, Alert, Tabs } from 'antd'
const { TextArea } = Input
const TabPane = Tabs.TabPane
const Option = Select.Option
const FormItem = Form.Item
const connectForm = Form.create()

import Membership from './Membership/Membership'

/*
CONFIG PAGE:
Provides admins with a basic CMS!
General view allows you to edit content, enums etc
Members view allows you to add / remove members
*/
import styles from './Config.css'
@compose(
  connect(
    state => ({
      user: state.user,
      id: state.config._id,
      enums: state.config.enums,
      submissions: state.config.submissions,
      year: state.config.year,
      quarter: state.config.quarter,
      annualFunds: state.config.annualFunds,
      blockFunds: state.config.blockFunds,
      news: state.config.news,
      timeline: state.config.timeline,
      links: state.config.links
    }),
    /*
    NOTE: state.config exists in an isomorphic context, loads before page render.
    As such, it has its own reducer - it just calls API services and updates itself with the response.
    */
    dispatch => ({ updateConfig: bindActionCreators(updateConfig, dispatch) })
  ),
  connectForm
)
class Config extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    updateConfig: PropTypes.func,
    id: PropTypes.string,
    status: PropTypes.string,
    submissions: PropTypes.bool,
    year: PropTypes.number,
    quarter: PropTypes.string,
    annualFunds: PropTypes.number,
    blockFunds: PropTypes.number,
    news: PropTypes.string,
    timeline: PropTypes.array,
    links: PropTypes.object,
    enums: PropTypes.shape({
      categories: PropTypes.array,
      organizations: PropTypes.object,
      questions: PropTypes.shape({
        review: PropTypes.array
      })
    })
  }
  componentDidMount () {
    const { form, enums, submissions, year, quarter, annualFunds, blockFunds, news, timeline, links } = this.props
    if (form && enums) {
      const { organizations, categories, questions } = enums
      const { rfp, drive, keyserver } = links
      const orgCodeMap = Object.keys(organizations)
        .map(key => `${key}:${organizations[key]}`)
      form.setFieldsValue({
        submissions,
        news,
        timeline,
        categories,
        year,
        quarter,
        annualFunds,
        blockFunds,
        rfp,
        drive,
        keyserver,
        reviewQuestions: questions.review,
        organizations: orgCodeMap
      })
    }
  }
  handleSubmissions = (submissions) => {
    const { updateConfig, id } = this.props
    updateConfig({ submissions }, { id })
  }
  handleYear = (year) => {
    const { updateConfig, id } = this.props
    updateConfig({ year }, { id })
  }
  handleAnnualFunds = (annualFunds) => {
    const { updateConfig, id } = this.props
    updateConfig({ annualFunds }, { id })
  }
  handleBlockFunds = (blockFunds) => {
    const { updateConfig, id } = this.props
    updateConfig({ blockFunds }, { id })
  }
  handleQuarter = (quarter) => {
    const { updateConfig, id } = this.props
    updateConfig({ quarter }, { id })
  }
  handleNews = (news) => {
    const { updateConfig, id } = this.props
    updateConfig({ news }, { id })
  }
  handleLinks = (update) => {
    const { updateConfig, id } = this.props
    const links = Object.assign({}, this.props.links, update)
    updateConfig({ links }, { id })
  }

  handleTimeline = (timeline) => {
    const { updateConfig, id } = this.props
    updateConfig({ timeline }, { id })
  }

  handleOrganizations = (encodedOrgData) => {
    //  De-encode org data, transform into obj
    const organizations = {}
    for (const encoded of encodedOrgData) {
      const [org, code] = encoded.split(':')
      organizations[org] = code || ''
    }
    const { updateConfig, id } = this.props
    //  Immutability magic
    let enums = Object.assign({}, this.props.enums)
    enums.organizations = organizations
    updateConfig({ enums }, { id })
  }

  handleCategories = (categories) => {
    const { updateConfig, id } = this.props
    //  Immutability magic
    let enums = Object.assign({}, this.props.enums)
    enums.categories = categories
    updateConfig({ enums }, { id })
  }

  handleQuestions = (questions) => {
    const { updateConfig, id } = this.props
    //  Immutability magic
    let enums = Object.assign({}, this.props.enums)
    enums.questions.review = questions
    updateConfig({ enums }, { id })
  }

  render ({ router, form, id, enums } = this.props) {
    return (
      <article className={styles['article']}>
        <Helmet title='Site Config' />
        <Loading id={id} render={id}
          title='UWSTF Content Management System'
          tip='Loading Site Configuration'
        >
          <h1>Web Configuration</h1>
          <h6>Here be dragons...</h6>
          <p>Please be advised that changes go into effect IMMEDIATELY, users will experience the change after refreshing their page.</p>
          <Tabs>
            <TabPane tab='Site Configuration' key='1'>
              <Alert type='warning' showIcon banner
                message='Please be advised that changes go into effect IMMEDIATELY, users will experience the change after refreshing their page.'
              />
              <FormItem {...layout} label={<Label title='Submissions'
                message={'Open or close submissions for authors. Admins can still log into proposals and change them after closure.'} />}>
                {form.getFieldDecorator('submissions', { valuePropName: 'checked' })(
                  <Switch onChange={this.handleSubmissions}
                    checkedChildren='Open' unCheckedChildren='Closed'
                  />
                )}
              </FormItem>
              <FormItem {...layout} label={<Label title='Fiscal Year'
                message={'Set the year of your proposal cycle. This may not be intuitive, for example, Autumn 2017 proposals are in the 2018 FY'} />}>
                {form.getFieldDecorator('year')(
                  <InputNumber min={2000} max={2030} onChange={(year) => this.handleYear(year)} />
                  // <InputNumber min={2000} max={2030} onChange={(e) => this.handleYear(e.target.value)} />
                )}
              </FormItem>
              <FormItem {...layout} label='Quarter'>
                {form.getFieldDecorator('quarter')(
                  <Select onChange={this.handleQuarter}>
                    <Option value='Autumn'>Autumn</Option>
                    <Option value='Winter'>Winter</Option>
                    <Option value='Spring'>Spring</Option>
                    <Option value='Summer'>Summer</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem {...layout} label={<Label title='Total Budget'
                message={'Estimated funds to allocate for this fiscal year. This information is referenced in various parts of the site as a performance metric'} />}>
                {form.getFieldDecorator('annualFunds')(
                  <InputNumber min={1000000} max={10000000}
                    style={{ minWidth: 150 }}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    onChange={(annualFunds) => this.handleAnnualFunds(annualFunds)}
                  />
                )}
              </FormItem>
              <FormItem {...layout} label={<Label title='Block Budget'
                message={'Estimated annual funds dedicated to block funding and special projects. These funds are reserved out of the total budget.'} />}>
                {form.getFieldDecorator('blockFunds')(
                  <InputNumber min={0} max={10000000}
                    style={{ minWidth: 150 }}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    onChange={(blockFunds) => this.handleBlockFunds(blockFunds)}
                  />
                )}
              </FormItem>
              <FormItem {...layout} label={<Label title='Announcements'
                message={'Frontpage content directly underneath "Announcements"'} />}>
                {form.getFieldDecorator('news')(
                  <TextArea rows={6} onPressEnter={(e) => this.handleNews(e.target.value)} />
                )}
              </FormItem>
              <FormItem {...layout} label={<Label title='Timeline'
                message={'Add or remove timeline points from the frontpage. The last elementa added is shown as the pending or upcoming event..'} />}
              >
                {form.getFieldDecorator('timeline')(
                  <Select mode='tags' onChange={this.handleTimeline} />
                )}
              </FormItem>
              <FormItem {...layout} label={<Label title='RFP'
                message={'RFP link in the navbar'} />}>
                {form.getFieldDecorator('rfp')(
                  <Input onPressEnter={(e) => this.handleLinks({ rfp: e.target.value })} />
                )}
              </FormItem>
              <FormItem {...layout} label={<Label title='Drive'
                message={'Google drive link in the navbar'} />}>
                {form.getFieldDecorator('drive')(
                  <Input rows={6} onPressEnter={(e) => this.handleLinks({ drive: e.target.value })} />
                )}
              </FormItem>
              <FormItem {...layout} label={<Label title='Keyserver'
                message={'Keyserver link in the navbar'} />}>
                {form.getFieldDecorator('keyserver')(
                  <Input rows={6} onPressEnter={(e) => this.handleLinks({ keyserver: e.target.value })} />
                )}
              </FormItem>
              <FormItem {...layout} label={<Label title='Organizations'
                message={'This includes budget codes as well, separated by a colon. Format: <name>:<budgetcode>'} />}
              >
                {form.getFieldDecorator('organizations')(
                  <Select mode='tags'
                    style={{ maxWidth: '100%' }}
                    onChange={this.handleOrganizations}
                  >
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
              <FormItem {...layout} label={<Label title='Metric Questions'
                message={'Add or remove metrics questions. These are best kept brief, without symbols.'} />}
              >
                {form.getFieldDecorator('reviewQuestions')(
                  <Select mode='tags'
                    style={{ maxWidth: '100%' }}
                    onChange={this.handleQuestions}
                  >
                    {enums.questions.review && enums.questions.review
                      .map(prompt => (
                        <Option key={prompt}>{prompt}</Option>
                      ))}
                  </Select>
                )}
              </FormItem>
            </TabPane>
            <TabPane tab='Membership' key='2'>
              <Membership />
            </TabPane>
          </Tabs>
        </Loading>
      </article>
    )
  }
}
export default Config
