import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'

import { Table, Alert } from 'antd'

const currency = value => `$${Number.parseInt(value).toLocaleString()}`

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

const Metrics = ({ _id: id, approved, score, ratings, author: { name, netID } }) => (
  <div>
    <Alert key={id}
      style={{ paddingLeft: 8 }}
      banner showIcon={false}
      type={approved ? 'success' : 'error'}
      message={<h6>{`${name} (${netID})`}</h6>}
    />
    <Table
      style={{ marginBottom: 16 }}
      columns={columns}
      dataSource={ratings}
      rowKey={record => record._id}
      size='middle'
      pagination={false}
      showHeader={false}
      footer={() => (
        <h5>
          <span>Overall Rating: </span>
          <span style={{ float: 'right' }}>{`${score} / 5`}</span>
        </h5>
      )}
    />
  </div>
)

export default Metrics
