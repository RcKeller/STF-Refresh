import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../../services'

import { Link } from 'react-router'
import { Spin, Table, Switch, Input, Icon, message } from 'antd'
const InputGroup = Input.Group

// import styles from './Membership.css'

/*
[
    {
      _id: '5991d88bae3e6f4ad0669bc4',
      user: {
        _id: '5991d88bae3e6f4ad0669bbf',
        netID: 'jane20',
        email: 'makenna93@yahoo.com',
        stf: {
          _id: '5991d88bae3e6f4ad0669bc4',
          user: '5991d88bae3e6f4ad0669bbf',
          spectator: true,
          member: true,
          admin: true,
          __v: 0
        },
        __v: 0,
        tokens: [],
        name: 'Lupe Nolan'
      },
      spectator: true,
      member: true,
      admin: true,
      __v: 0
    },
*/

@compose(
  connect(
    state => ({
      screen: state.screen,
      committee: state.db.stf
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
),
  //  NOTE: Raw query to deal with plurality and namespace fuzziness.
  connectRequest(() => api.query('stf?join=user', {
    update: { stf: (prev, next) => next },
    transform: res => ({ stf: res }),
    force: true
  }))
)
class Membership extends React.Component {
  constructor (props) {
    super(props)
    this.columns = [{
      title: 'Name',
      dataIndex: 'user.name',
      key: 'user.name'
    }, {
      title: 'NetID',
      dataIndex: 'user.netID',
      key: 'proposal.title',
      width: 100
    },
    {
      title: 'Officio',
      dataIndex: 'spectator',
      key: 'spectator',
      render: (text, record, index) => <Switch checked={text} onChange={spectator => this.handleToggle({ spectator }, record, index)} />,
      width: 65
    }, {
      title: 'Member',
      dataIndex: 'member',
      key: 'member',
      render: (text, record, index) => <Switch checked={text} onChange={member => this.handleToggle({ member }, record, index)} />,
      width: 80
    }, {
      title: 'Admin',
      dataIndex: 'admin',
      key: 'admin',
      render: (text, record, index) => <Switch checked={text} onChange={admin => this.handleToggle({ admin }, record, index)} />,
      width: 65
    }
    ]
  }
  handleAddMember = (netID) => {
    const member = { netID, spectator: false, member: false, admin: false }
    console.log(member)
  }
  handleToggle = (change, record, index) => {
    //  Assign the change to a body, send it to the server.
    const { api } = this.props
    let body = Object.assign(record, change)
    const id = body._id
    // Update the record at the table's index
    const update = { stf: (prev, next) => {
      let newData = prev.slice()
      newData[index] = body
      return newData
    }}
    //  NOTE: Raw query to deal with plurality and namespace fuzziness.
    api.mutate(`stf/${id}`, {
      options: { method: 'PATCH' },
      transform: res => ({ stf: res }),
      body,
      update
    })
    .then(message.success(('Authorization for user updated!'), 10))
    .catch(err => {
      message.warning(`Failed to update user - client error`)
      console.warn(err)
    })
  }
  render (
    { columns } = this,
    { screen, committee } = this.props
  ) {
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
            footer={() => (
              <Input label='Add a member by netID' prefix={<Icon type='user' />}
                onPressEnter={(e) => this.handleAddMember(e.target.value)}
            />
            )}
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
