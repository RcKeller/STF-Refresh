import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

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
      user: state.user
      //  Config, content, enums
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Config extends React.Component {
  handleSubmissions = (checked) => {
    console.log(checked)
  }
  render ({ form } = this.props) {
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
              <Switch onChange={(checked) => this.handleSubmissions(checked)}
                checkedChildren='Open' unCheckedChildren='Closed'
              />
            </FormItem>
          </TabPane>
          <TabPane tab='STF Members' key='4'>
            Modify members
          </TabPane>
          <TabPane tab='Organizations' key='5'>
            Add organization types
          </TabPane>
        </Tabs>
      </article>
    )
  }
}
Config.propTypes = {
  user: PropTypes.object
}
export default Config
