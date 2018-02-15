import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../../services'

import { usersOnCommittee, usersNotOnCommittee } from '../../../../selectors'

import { Spin, Table, Checkbox, AutoComplete, Tooltip, Alert, message } from 'antd'
const Option = AutoComplete.Option

const filterOption = (inputValue, option) =>
  option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1

/*
MEMBERSHIP TAB:
Allows you to add and remove committe members
NOTE: Once added to the STF, they are a PART of STF
Even if not a member, they CAN view internal information
*/
@compose(
  connect(
    //  Committee members vs. potential members to add.
    state => ({
      committee: usersOnCommittee(state),
      users: usersNotOnCommittee(state)
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
),
  connectRequest(() => api.get('users', { populate: ['stf'] }))
)
class Membership extends React.Component {
  static propTypes = {
    api: PropTypes.object,
    manifests: PropTypes.array,
    screen: PropTypes.object
  }
  constructor (props) {
    super(props)
    this.columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: 'NetID',
      dataIndex: 'netID',
      key: 'netID',
      width: 100
    },
    {
      title: 'Roles',
      dataIndex: 'stf',
      key: 'stf',
      render: (text, record, index) => (
        <div>
          <Checkbox
            checked={text.spectator}
            onChange={e => this.handleToggle({ spectator: e.target.checked }, record, index)}
          >Ex-Officio</Checkbox>
          <Checkbox
            checked={text.member}
            onChange={e => this.handleToggle({ member: e.target.checked }, record, index)}
          >Member</Checkbox>
          <Checkbox
            checked={text.admin}
            onChange={e => this.handleToggle({ admin: e.target.checked }, record, index)}
          >Admin</Checkbox>
        </div>
      ),
      filters: [
        { text: 'Ex-Officio', value: 'spectator' },
        { text: 'Member', value: 'member' },
        { text: 'Admin', value: 'admin' }
      ],
      onFilter: (value, record) => record.stf[value],
      width: 120
    }]
  }
  handleAddMember = (user) => {
    const { api } = this.props
    const body = { user, spectator: false, member: false, admin: false }
    const params = {
      transform: users => ({ users }),
      update: ({ users: (prev, next) => {
        let changed = prev.slice()
        let index = changed.findIndex(u => u._id === user)
        if (index >= 0) changed[index].stf = next
        return changed
      }})
    }
    api.post('stf', body, params)
  }
  handleToggle = (value, record, index) => {
    const { api } = this.props
    const { _id: id, spectator, member, admin } = record.stf
    const permissions = { spectator, member, admin, ...value }
    const params = {
      id,
      transform: (users) => ({ users }),
      update: { users: (prev, next) => {
        let update = prev.slice()
        let index = update.findIndex(u => u.stf && u.stf._id === id)
        if (index >= 0) update[index].stf = next
        return update
      }}
    }
    api.patch('stf', permissions, params)
    .then(message.success('Updated user', 10))
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }
  render (
    { columns } = this,
    { committee, users } = this.props
  ) {
    return (
      <section>
        <Alert type='info' showIcon banner
          message='Add and Configure Members'
          description='WARNING: Reviews are tied to author accounts! Adjusting membership will alter the visibility of their voting record. Members can be added via the textbox in the footer.'
        />
        {!committee
          ? <Spin size='large' tip='Loading...' />
          : <Table dataSource={committee} sort pagination={false}
            size='middle'
            columns={columns}
            rowKey={record => record._id}
            footer={() =>
              <Tooltip trigger='focus'
                title='You may add any user to the committee, as long as they have logged into the website before. This is irreversible (to preserve voting logs).'
              >
                <AutoComplete style={{ width: 300 }}
                  placeholder='Add STF members...'
                  onSelect={this.handleAddMember}
                  filterOption={filterOption}
                >
                  {users.map(user => <Option key={user._id}>{`${user.name} (${user.netID})`}</Option>)}
                </AutoComplete>
              </Tooltip>
            }
          />
        }
      </section>
    )
  }
}
export default Membership
