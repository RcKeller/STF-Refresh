import React from 'react'
import PropTypes from 'prop-types'
// import _ from 'lodash'

import { connect } from 'react-redux'

import { Table, Tooltip, Icon } from 'antd'

const currency = value => `$${Number.parseInt(value).toLocaleString()}`
/*
MANIFESTS VIEW: Renders the budgets associated with a proposal, starting with the most recent (or approved) manifest
*/
@connect(state => ({
  screen: state.screen
}))
class Manifests extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    screen: PropTypes.object
  }
  static defaultProps = {
    items: [],
    total: 0,
    screen: {}
  }
  columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <b>{text}</b>
    },
    {
      title: <span>
        <Tooltip placement='left' title='Tax Included. Hover for item subtotals.'>
          Price/ea&nbsp;
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>,
      // title: <Tooltip placement='left' title='Tax Included. Mouse over for item subtotals.'>Price/ea</Tooltip>,
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => <Tooltip placement='left'
        title={`Subtotal: ${currency(record.tax
          ? record.price * record.quantity * (1 + record.tax / 100)
          : record.price * record.quantity)}`}>
        {currency(record.price * (1 + record.tax / 100))}
      </Tooltip>,
      sorter: (a, b) => a.price - b.price,
      width: 120,
      padding: 0
    },
    { title: 'Q',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 50
    }
  ]
  expandedRowRender = ({ price, tax, description } = {}) => {
    return <span>
      <em>{Number.parseFloat(tax) > 0 ? `${tax}% tax applied to base cost (${currency(price)})` : 'Untaxed or taxed separately'}</em>
      <p>{description || <em>No description provided</em>}</p>
    </span>
  }
  footer = () => <span><h2>{`Grand Total: ${currency(this.props.total || 0)}`}</h2><h6>Tax Included in Calculation</h6></span>
  render (
    { items, total, screen } = this.props
  ) {
    return (
      <div>
        <h1>Budget</h1>
        {items &&
          <Table dataSource={items} sort
            size='middle'
            columns={this.columns}
            rowKey={record => record._id}
            //  The above will throw an error if using faker data, since duplicates are involved.
            expandedRowRender={screen.greaterThan.small ? this.expandedRowRender : false}
            defaultExpandAllRows={screen.greaterThan.small}
            pagination={false}
            footer={this.footer}
          />
        }
      </div>
    )
  }
}

export default Manifests
