import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// const currency = number =>
//   number.toLocaleString('en-US', {
//     style: 'currency',
//     currency: 'USD'
//   })
const currency = value => `$${Number.parseInt(value).toLocaleString()}`

import { Spin, Table, Tooltip } from 'antd'

const columns = [
  {
    title: <Tooltip placement='right' title='Author-supplied priority number used to stack rank the importance of items.'>#</Tooltip>,
    dataIndex: 'priority',
    key: 'priority',
    sorter: (a, b) => (a.priority) - (b.priority),
    width: 50
  },
  {
    title: 'Priority / Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => <b>{text}</b>
  },
  { title: <Tooltip placement='left' title='Tax Included. Mouse over for item subtotals.'>Price/ea</Tooltip>,
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

const expandedRowRender = record => record.description
  ? <div><em>{record.tax ? 'Tax-Free' : `${record.tax}% tax included in calculation`}</em><h6>Description: </h6>{record.description}</div>
  : <em>No description provided.</em>

@connect(
    //  Might seem counterintuitive, but we're connecting to a manifest and pulling its proposal data.
    (state, props) => ({
      manifest: state.db.manifests
        .find(manifest => manifest._id === props.id) || {},
      items: state.db.manifests
        .find(manifest => manifest._id === props.id).items || [],
      screen: state.screen
    })
)
class Budget extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    manifest: PropTypes.object,
    user: PropTypes.object
  }
  render (
    { screen, manifest } = this.props
  ) {
    const footer = () => <span><h2>{`Grand Total: ${currency(manifest.total || 0)}`}</h2><h6>Tax Included in Calculation</h6></span>
    const { type, title, body, items } = manifest
    return (
      <div>
        {manifest
          ? <section>
            {type === 'supplemental' &&
            <div>
              <h1>Supplemental Information</h1>
              <h3>{title || 'Untitled Supplemental'}</h3>
              <p>{body || 'No information provided by the author'}</p>
            </div>
          }
            <Table dataSource={items || []} sort
              size='middle'
              columns={columns}
              rowKey={record => record._id}
              //  The above will throw an error if using faker data, since duplicates are involved.
              expandedRowRender={screen.greaterThan.medium ? expandedRowRender : false}
              defaultExpandAllRows={screen.greaterThan.medium}
              pagination={false}
              footer={footer}
            />
          </section>
        : <Spin size='large' tip='Loading...' />

        }
      </div>
    )
  }
}

export default Budget
