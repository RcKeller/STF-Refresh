import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'
import { layout } from '../../../util/form'

import { Spin, Tabs, Form, Input, Select, Checkbox, Switch, Alert, message } from 'antd'
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
      config: state.db.config,
      // member: state.db.stfs
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  // connectRequest(api.get('blocks')),
  connectForm
)
class Config extends React.Component {
  componentDidMount () {
    //  Take contacts, make an object with role-to-signature bool, use this to set initial vals.
    // super.componentDidMount()
    const { form, config } = this.props
    if (form && config) {
      form.setFieldsValue({...config})
    }
  }
  handleSubmissions = (submissions) => {
    const { api, id } = this.props
    const update = {
      config: (prev, next) => Object.assign(prev, { submissions: next.submissions })
    }
    api.patch('config', { submissions }, { id, update })
    .then(message.warning(`Proposal submissions are now ${submissions ? 'open' : 'closed'}!`), 10)
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }
  handleOrganizations = (organizations) => {
    const { api, id } = this.props
    const update = {
      config: (prev, next) => Object.assign(prev, { organizations: next.organizations })
    }
    api.patch('config', { organizations }, { id, update })
    .then(message.warning(`Updated organizations!`), 10)
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }
  render ({ form, config } = this.props) {
    return (
      <article className={styles['article']}>
        {!config
          ? <Spin size='large' tip='Loading...' />
          : <div>
            <h1>Web Configuration</h1>
            <h6>Here be dragons...</h6>
            <p>Here you can update various configuration settings for the website, such as opening/closing proposal submissions, editing announcements, updating the pre-selected list of campus organizations, modifying access permissions for STF members, etc.</p>
            <p>Please be advised that changes go into effect IMMEDIATELY, users will experience the change after refreshing their page.</p>
            <hr />
            <FormItem label='Announcement A' {...layout} >
              {form.getFieldDecorator('announcements[0]')(
                <Input type='textarea' rows={3} />
              )}
            </FormItem>
            <FormItem label='Announcement B' {...layout} >
              {form.getFieldDecorator('announcements[1]')(
                <Input type='textarea' rows={3} />
              )}
            </FormItem>
            <FormItem label='Announcement C' {...layout} >
              {form.getFieldDecorator('announcements[2]')(
                <Input type='textarea' rows={3} />
              )}
            </FormItem>
            <FormItem label='Submissions' {...layout} >
              {form.getFieldDecorator('submissions', { valuePropName: 'checked' })(
                <Switch onChange={(checked) => this.handleSubmissions(checked)}
                  checkedChildren='Open' unCheckedChildren='Closed'
                />
              )}
            </FormItem>
            <FormItem label='Organizations' {...layout} >
              {form.getFieldDecorator('organizations')(
                <Select mode='tags' placeholder='Type the name of an organization to add'
                  onChange={(organizations) => this.handleOrganizations(organizations)}
                >
                  {config.organizations &&
                      config.organizations.map(org => <Option key={org}>{org}</Option>)}
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
// Config.propTypes = {
//   form: PropTypes.object,
//   api: PropTypes.object,
//   id: PropTypes.string,
//   submissions: PropTypes.array,
//   organizations: PropTypes.array,
//   announcements: PropTypes.array,
//   status: PropTypes.string
// }
export default Config
