import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Table, Alert, Select } from 'antd'

// const columns = [
//   {
//     title: 'Priority',
//     dataIndex: 'priority',
//     key: 'priority',
//     sorter: (a, b) => (a.priority) - (b.priority),
//     width: 90
//   },
//   {
//     title: 'Name',
//     dataIndex: 'name',
//     key: 'name'
//   },
//   { title: 'Price',
//     dataIndex: 'price',
//     key: 'price',
//     render: (text, record) => <span>{`${record.price} x ${record.tax}`}</span>,
//     sorter: (a, b) => (a.price * a.tax) - (b.price * b.tax),
//     width: 120
//   },
//   { title: 'Quantity',
//     dataIndex: 'quantity',
//     key: 'quantity',
//     width: 90
//   }
// ]

// const expandedRowRender = record => <p><h6>Description: </h6>{record.description}</p>

class SubTable extends React.Component {
  render (
    { manifest, report } = this.props
  ) {
    return (
      <div>
        {manifest._id}
        <br />
        {report._id}
      </div>
    )
  }
}

SubTable.propTypes = {
  manifest: PropTypes.object,
  report: PropTypes.object
}
export default SubTable
