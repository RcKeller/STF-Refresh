import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest, requestAsync, mutateAsync } from 'redux-query'

import api from '../../../../services'

import { Link } from 'react-router'
import { Spin, Table, Switch, AutoComplete, message } from 'antd'
const Option = AutoComplete.Option

const toggle = (id, body, update) => mutateAsync({
  url: `${api.endpoint}/stf/${id}`,
  options: { method: 'PATCH' },
  transform: res => ({ users: res }),
  body,
  update
})

@compose(
  connect(
    state => ({
      //  Committee members vs. potential members to add.
      committee: Array.isArray(state.db.users)
      ? state.db.users.filter(user => user.stf !== null)
      : [],
      users: Array.isArray(state.db.users)
        ? state.db.users.filter(user => user.stf === null)
        : []
    }),
    dispatch => ({
      //  NOTE: Bind custom mutators to deal with plurality constraints for the 'stf' controller.
      api: bindActionCreators({toggle, ...api}, dispatch)
    })
),
  connectRequest(() => api.get('users'))
)
class Membership extends React.Component {
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
    }, {
      title: 'Officio',
      dataIndex: 'stf.spectator',
      key: 'stf.spectator',
      render: (text, record, index) => <Switch checked={text} onChange={spectator => this.handleToggle({ spectator }, record, index)} />,
      width: 65
    }, {
      title: 'Member',
      dataIndex: 'stf.member',
      key: 'stf.member',
      render: (text, record, index) => <Switch checked={text} onChange={member => this.handleToggle({ member }, record, index)} />,
      width: 80
    }, {
      title: 'Admin',
      dataIndex: 'stf.admin',
      key: 'stf.admin',
      render: (text, record, index) => <Switch checked={text} onChange={admin => this.handleToggle({ admin }, record, index)} />,
      width: 65
    }
    ]
  }
  handleAddMember = (user) => {
    const { api } = this.props
    const body = { user, spectator: false, member: false, admin: false }
    console.log(body)
    const update = { users: (prev, next) => {
      console.log(prev, next)
      let newData = prev.slice()
      if (typeof next === 'object') newData.push(next)
      return newData
    }}
    api.post('users', body, { update })
  }
  handleToggle = (change, record, index) => {
    //  Assign the change to a body, send it to the server.
    console.warn(change, record, index)
    const { api } = this.props
    const body = Object.assign(record.stf, change)
    const id = body._id
    // // Update the record at the table's index
    // const update = { stf: (prev, next) => {
    //   let newData = prev.slice()
    //   newData[index] = body
    //   return newData
    // }}
    const update = { users: (prev, next) => {
      console.log(prev, next)
      // let newData = prev.slice()
      // newData[index] = body
      // return newData
      return prev
    }}
    console.warn('body', body)
    api.toggle(id, body, update)
    // .then(message.success(('Authorization for user updated!'), 10))
    // .catch(err => {
    //   message.warning(`Failed to update user - client error`)
    //   console.warn(err)
    // })
  }
  render (
    { columns } = this,
    { committee, users } = this.props
  ) {
    // const UserOptions = users.map(user => <Option key={user._id}>{`${user.name} (${user.netID})`}</Option>)
    return (
      <section>
        <h1>Committee Membership</h1>
        <h6>WARNING: Reviews are tied to author accounts</h6>
        <p>Adjusting membership will alter the visibility of their voting record.</p>
        {!committee
          ? <Spin size='large' tip='Loading...' />
          : <Table dataSource={committee} sort pagination={false}
            size='middle'
            columns={columns}
            footer={() =>
              <AutoComplete style={{ width: 250 }}
                placeholder='Add a user to the STF...'
                onSelect={this.handleAddMember}
              >
                {users.map(user => <Option key={user._id}>{`${user.name} (${user.netID})`}</Option>)}
              </AutoComplete>
            }
            // footer={() => (
            //   <Input label='Add a member by netID' prefix={<Icon type='user' />}
            //     onPressEnter={(e) => this.handleAddMember(e.target.value)}
            // />
            // )}
          />
        }
      </section>
    )
  }
}
Membership.propTypes = {
  api: PropTypes.object,
  manifests: PropTypes.array,
  screen: PropTypes.object
}
export default Membership
