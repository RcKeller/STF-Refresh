import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// import _ from 'lodash'

import { Table, Alert, Tooltip, Icon } from 'antd'

import Metrics from './Metrics/Metrics'

const currency = value => `$${Number.parseInt(value).toLocaleString()}`

const columns = [
  {
    title: <span>
      <Tooltip placement='right' title='Some proposals have author supplied priority numbers that stack-rank items by importance.'>
        Name&nbsp;
        <Icon type='question-circle-o' />
      </Tooltip>
    </span>,
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => <b>{
      record.priority
        ? `${record.priority}: ${text}`
        // ? <span><em>#{record.priority}: </em> {text}</span>
        : text
      }</b>,
    sorter: (a, b) => (b.priority) - (a.priority)
    // sorter: (a, b) => (a.priority) - (b.priority)
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
    // width: screen.greaterThan.medium ? 120 : 100,
    padding: 0
  },
  { title: 'Q',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 50
  }
]
class Decision extends React.Component {
  // static propTypes = {
  //   _id: PropTypes.string,
  //   netID: PropTypes.string,
  //   email: PropTypes.string,
  //   name: PropTypes.string,
  //   stf: PropTypes.object
  // }
  static defaultProps = {
    asked: 0,
    title: 'Untitled Budget',
    decision: { body: 'A decision has not been issued.' },
    reviews: []
  }
  render ({ asked, _id: id, type, title, items, total, decision, reviews, user } = this.props) {
    //  { _id: id, netID, email, name, stf } = this.props
    const { body } = decision
    const status = typeof decision.approved === 'undefined'
      ? 'active'
      : (decision.approved ? 'success' : 'error')
    return (
      <div>
        <Table dataSource={items || []} sort
          size='middle'
          columns={columns}
          rowKey={record => record._id}
          pagination={false}
        />
        <Alert banner showIcon={false}
          style={{ padding: 8 }}
          type={status}
          message={<h2>
            <span>
              {status === 'active'
                ? 'Undecided'
                : decision.approved ? 'Funded' : 'Denied'
              }
            </span>
            <span style={{ float: 'right' }}>{currency(total)}</span>
          </h2>}
          description={body}
        />
        {/* Committee members have an expanded view that includes metrics */}
        {user && user.stf &&
          <div>
            {reviews.length > 0
              ? <h2>Committee Metrics</h2>
              : <h6>Metrics have not been taken for this budget</h6>
            }
            {reviews && reviews.map(rev => <Metrics key={rev._id} {...rev} />)}
          </div>
        }
      </div>
    )
  }
}

export default Decision
