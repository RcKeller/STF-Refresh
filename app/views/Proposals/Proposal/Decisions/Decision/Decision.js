import React from 'react'
import PropTypes from 'prop-types'
// import { connect } from 'react-redux'

// import _ from 'lodash'

import { Table, Alert, Tooltip, Icon } from 'antd'
import { Boundary } from '../../../../../components'

import Metrics from './Metrics/Metrics'

const currency = value => `$${Number.parseInt(value).toLocaleString()}`

/*
DECISION COMPONENT:
Provides a table view of a budget including
the award status / amount in an alert
*/
class Decision extends React.Component {
  static propTypes = {
    asked: PropTypes.number.isRequired,
    title: PropTypes.string,
    body: PropTypes.string,
    decision: PropTypes.shape({
      body: PropTypes.string
    }),
    items: PropTypes.array.isRequired,
    reviews: PropTypes.arrayOf(PropTypes.shape({
      approved: PropTypes.bool,
      ratings: PropTypes.arrayOf(PropTypes.shape({
        prompt: PropTypes.string,
        score: PropTypes.number
      })),
      author: PropTypes.shape({
        name: PropTypes.string,
        netID: PropTypes.string
      })
    }))
  }
  static defaultProps = {
    asked: 0,
    title: 'Untitled Budget',
    body: '',
    decision: { body: 'A decision has not been issued.' },
    reviews: []
  }
  columns = [
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
  render (
    { columns } = this,
    { asked, _id: id, type, title, body, items, total, decision, reviews, user } = this.props
  ) {
    const status = typeof decision.approved === 'undefined'
      ? 'active'
      : (decision.approved ? 'success' : 'error')
    return (
      <Boundary title={`Decisions for Budget ${id}`}>
        <Table dataSource={items || []} sort
          size='middle'
          columns={columns}
          rowKey={record => record._id}
          pagination={false}
        />
        <div>{body}</div>
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
          description={decision.body}
        />
        {/* Committee members have an expanded view that includes metrics */}
        {user && user.stf &&
          <div>
            <hr />
            {Array.isArray(reviews) && reviews.length > 0
              ? <h2>Committee Metrics</h2>
              : <Alert type='info' showIcon message='Metrics have not been taken for this budget' />
            }
            {reviews && reviews.map(rev => <Metrics key={rev._id} {...rev} />)}
          </div>
        }
      </Boundary>
    )
  }
}

export default Decision
