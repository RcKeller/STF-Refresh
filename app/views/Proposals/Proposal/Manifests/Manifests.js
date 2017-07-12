import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Table, Alert, Select } from 'antd'
const Option = Select.Option

const columns = [
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
    sorter: (a, b) => (a.priority) - (b.priority),
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
    sorter: (a, b) => (a.price * a.tax) - (b.price * b.tax),
    width: 120
  },
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
  constructor (props) {
    super(props)
    this.state = { index: props.manifests.length - 1 }
  }
  handleChange (value) {
    this.setState({ index: value })
  }

  render (
    { manifests, screen } = this.props,
    { index } = this.state
  ) {
    return (
      <div>
        <h1>Budget & Manifest</h1>
        {manifests.length > 1 &&
          <Alert type='info' showIcon
            message='Multiple Manifests'
            description='This proposal has multiple manifests as a result of partial awards or amendments. Use the dropdown below to browse through them all.'
          />
        }
        <Table dataSource={manifests[index].items} sort
          size={screen.lessThan.medium ? 'small' : 'middle'}
          columns={screen.lessThan.medium ? columns.slice(1, 4) : columns}
          rowKey={record => record._id}
          //  The above will throw an error if using faker data, since duplicates are involved.
          title={() => (
            <Select size='large' style={{ width: '100%' }}
              defaultValue={(manifests.length - 1).toString()}
              onChange={(value) => this.handleChange(value)}
            >
              {manifests.map((m, i) =>
                <Option value={i.toString()}>{m.title}</Option>
              )}
            </Select>
          )}
          expandedRowRender={expandedRowRender}
          pagination={false}
        />
      </div>
    )
  }
}

Manifests.propTypes = {
  manifests: PropTypes.array,
  screen: PropTypes.object
}
export default Manifests
