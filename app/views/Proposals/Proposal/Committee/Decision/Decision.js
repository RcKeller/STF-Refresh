import React from 'react'
import PropTypes from 'prop-types'

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
  render ({ asked, _id: id, type, title, items, total, decision, reviews } = this.props) {
    //  { _id: id, netID, email, name, stf } = this.props
    console.warn('Author', this.props)
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
          type={status}
          message={<h3>Decision</h3>}
          description={body}
        />
        {/* Committee members have an expanded view that includes metrics */}
        {reviews.length > 0 && <h2>Committee Metrics</h2>}
        {reviews.map(rev => (
          <Metrics key={rev._id} {...rev} />
          // <Alert key={rev._id}
          //   banner showIcon={false}
          //   type={rev.approved ? 'success' : 'error'}
          //   message={<h6>{`${rev.author.name} (${rev.author.netID}) - ${rev.score} / 5`}</h6>}
          //   description={<ul>
          //     {rev.ratings.map((rating, i) => (
          //       <li key={i}>{JSON.stringify(rating)}</li>
          //     ))}
          //   </ul>}
          // />
        ))}
      </div>
    )
  }
}

export default Decision
