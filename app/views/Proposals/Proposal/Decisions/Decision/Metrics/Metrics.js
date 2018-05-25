import React from 'react'
// import PropTypes from 'prop-types'

import { Table, Alert } from 'antd'

const columns = [
  {
    title: 'Prompt',
    dataIndex: 'prompt',
    key: 'prompt'
  }, {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
    width: 40
  }
]
/*
METRICS COMPONENT:
Admins can view the individual scores cast by members
in a concise table format
*/
const Metrics = ({ _id: id, approved, body, score, ratings, author: { name, netID } }) => (
  <div>
    <Alert key={id}
      style={{ paddingLeft: 8 }}
      banner showIcon={false}
      type={typeof approved === 'boolean'
        ? approved ? 'success' : 'error'
        : 'info'
      }
      message={<h6>{`${name} (${netID})`}</h6>}
    />
    <p>{body}</p>
    <Table
      style={{ marginBottom: 16 }}
      columns={columns}
      dataSource={ratings}
      rowKey={record => record._id}
      size='middle'
      pagination={false}
      showHeader={false}
    />
  </div>
)

export default Metrics
