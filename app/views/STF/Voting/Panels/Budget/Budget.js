import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Table, Tooltip, Icon } from 'antd'

import { makeManifestByID } from '../../../../../selectors'
import { Loading } from '../../../../../components'

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
        : text
      }</b>,
    sorter: (a, b) => (b.priority) - (a.priority)
  },
  {
    title: <span>
      <Tooltip placement='left' title='Tax Included. Hover for item subtotals.'>
        Price/ea&nbsp;
        <Icon type='question-circle-o' />
      </Tooltip>
    </span>,
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

const expandedRowRender = ({ price, tax, description } = {}) => {
  return <span>
    <em>{Number.parseFloat(tax) > 0 ? `${tax}% tax applied to base cost (${currency(price)})` : 'Untaxed or taxed separately'}</em>
    <p>{description || <em>No description provided</em>}</p>
  </span>
}
/*
BUDGET PANEL:
A concise view of the manifest in question
*/
@connect(
    //  Might seem counterintuitive, but we're connecting to a manifest and pulling its proposal data.
    (state, props) => {
      const manifest = makeManifestByID(props.id)(state)
      return {
        manifest,
        screen: state.screen
      }
    }
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
    const { type, title, body, items, total } = manifest
    const footer = () => <span><h2>{`Grand Total: ${currency(total || 0)}`}</h2><h6>Tax Included in Calculation</h6></span>
    return (
      <section>
        <Loading render={manifest} title='Budget Panel'>
          <div>
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
          </div>
        </Loading>
      </section>
    )
  }
}

export default Budget
