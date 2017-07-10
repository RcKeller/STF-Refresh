import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Table } from 'antd'

const columns = [
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
    // sorter: (a, b) => (a.priority) - (b.priority),
    width: 90
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  { title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (text, record) => <span>{`${record.price} x ${record.tax}`}</span>,
    width: 120
  },
  // { title: 'Tax',
  //   dataIndex: 'tax',
  //   key: 'tax'
  // },
  { title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 90
  }
]

const expandedRowRender = record => <p><h6>Description: </h6>{record.description}</p>

@connect(state => ({
  manifests: state.db.proposal.manifests,
  screen: state.screen
}))
class Manifests extends React.Component {
  // constructor()
  render ({ manifests, screen } = this.props) {
    // mostRecentIndex = manifests.length - 1
    return (
      <Table dataSource={manifests[manifests.length - 1].items} sort
        size={screen.lessThan.medium ? 'small' : 'middle'}
        columns={screen.lessThan.medium ? columns.slice(1, 4) : columns}
        rowKey={record => record._id}
        //  The above will throw an error if using faker data, since duplicates are involved.
        title={() => (
          <h1>
            Manifests
          </h1>
        )}
        footer={() => 'Your proposals here'}
        expandedRowRender={expandedRowRender}
      />
    )
  }
}

Manifests.propTypes = {
  manifests: PropTypes.array,
  screen: PropTypes.object
}
export default Manifests
