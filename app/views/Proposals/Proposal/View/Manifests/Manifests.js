import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

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

// const expandedRowRender = record => <p><h6>Description: </h6>{record.description}</p>

const expandedRowRender = record => record.description
  ? <div><h6>Description: </h6>{record.description}</div>
  : <em>No description provided.</em>

@connect(state => ({
  manifests: state.db.proposal.manifests,
  screen: state.screen
}))
class Manifests extends React.Component {
  static propTypes = {
    manifests: PropTypes.array,
    screen: PropTypes.object
  }
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
        <h1>Budget</h1>
        <h1 className='demo-note' style={{ color: 'goldenrod' }}>UP FOR DEBATE</h1>
        <p className='demo-note' style={{ color: 'goldenrod' }}>Should this default to using the most recently approved/denied budget, or the most recent one in general?</p>
        {(manifests && manifests.length > 1) &&
          <Alert type='info' banner showIcon={false}
            message='Multiple Budgets'
            description={<div>
              <p>
                This proposal has multiple manifests as a result of partial awards or supplementals. The most recent one has automatically been selected. Feel free to select another below.
              </p>
              <Select size='large' style={{ width: '100%' }}
                defaultValue={(manifests.length - 1).toString()}
                onChange={(value) => this.handleChange(value)}
              >
                {manifests.map((m, i) =>
                  <Option value={i.toString()}><h4>{`
                    ${m.title ? m.title : _.capitalize(m.type)}
                     by ${m.author && m.author.name ? m.author.name : 'anonymous'}
                     - ${m.decision ? m.decision.approved ? 'Approved' : 'Denied' : 'Proposed'}
                  `
                }</h4></Option>
                )}
              </Select>
            </div>
          } />
        }
        <Table dataSource={manifests[index].items} sort
          size={screen.lessThan.medium ? 'small' : 'middle'}
          columns={screen.lessThan.medium ? columns.slice(1, 4) : columns}
          rowKey={record => record._id}
          //  The above will throw an error if using faker data, since duplicates are involved.
          expandedRowRender={expandedRowRender}
          pagination={false}
        />
      </div>
    )
  }
}

export default Manifests
