import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'
import { layout } from '../../../util/form'

import { Tabs, Form, Input, Select, Checkbox, Switch, Alert, message } from 'antd'
const TabPane = Tabs.TabPane
const Option = Select.Option
const FormItem = Form.Item
const connectForm = Form.create()

import styles from './Config.css'
// @connect(state => ({ user: state.user }))
@compose(
  connect(
    state => ({
      user: state.user,
      id: state.db.config && state.db.config._id,
      submissions: state.db.config && state.db.config.submissions,
      organizations: state.db.config && state.db.config.organizations,
      announcements: state.db.config && state.db.config.announcements,
      stage: state.db.config && state.db.config.stage
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Config extends React.Component {
  componentDidMount () {
    //  Take contacts, make an object with role-to-signature bool, use this to set initial vals.
    const { form, submissions } = this.props
    if (form) {
      form.setFieldsValue({ submissions })
    }
  }
  handleSubmissions = (submissions) => {
    console.log(submissions)
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
    console.warn(organizations)
  }
  render ({ form, organizations } = this.props) {
    return (
      <article className={styles['article']}>
        <h1>Web Configuration</h1>
        <h6>Here be dragons.</h6>
        <ul>
          <li>Modify announcements.</li>
          <li>Open/Close voting</li>
          <li>Edit STF committee</li>
          <li>Change Organization Types</li>
          <li>(?) Edit Q/A prompts</li>
        </ul>
        <Tabs tabPosition='left' size='small'>
          <TabPane tab='Announcements' key='1'>
            Create announcements
          </TabPane>
          <TabPane tab='Content' key='2'>
            Modify content (q.a. , prompts, tooltips etc).
          </TabPane>
          <TabPane tab='Submissions' key='3'>
            <FormItem label='Submissions'>
              {form.getFieldDecorator('submissions', { valuePropName: 'checked' })(
                <Switch onChange={(checked) => this.handleSubmissions(checked)}
                  checkedChildren='Open' unCheckedChildren='Closed'
                />
              )}
            </FormItem>
          </TabPane>
          <TabPane tab='STF Members' key='4'>
            Modify members
          </TabPane>
          <TabPane tab='Organizations' key='5'>
            Add organization types
            <Select mode='multiple' placeholder='Type the name of an organization to add'
              style={{ width: '100%' }}
              onChange={(organizations) => this.handleOrganizations(organizations)}
            >
              {organizations && organizations.map((org, i) => (
                <Option key={i}>{org}</Option>
              ))}
            </Select>
          </TabPane>
        </Tabs>
      </article>
    )
  }
}
Config.propTypes = {
  form: PropTypes.object,
  api: PropTypes.object,
  id: PropTypes.string,
  submissions: PropTypes.array,
  organizations: PropTypes.array,
  announcements: PropTypes.array,
  status: PropTypes.string
}
export default Config
