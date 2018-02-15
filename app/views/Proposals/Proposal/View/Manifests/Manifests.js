import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { connect } from 'react-redux'

import { Table, Alert, Select, Tooltip, Icon } from 'antd'
const Option = Select.Option

const currency = value => `$${Number.parseInt(value).toLocaleString()}`

const expandedRowRender = ({ price, tax, description } = {}) => {
  return <span>
    <em>{Number.parseFloat(tax) > 0 ? `${tax}% tax applied to base cost (${currency(price)})` : 'Untaxed or taxed separately'}</em>
    <p>{description || <em>No description provided</em>}</p>
  </span>
}

import { indexOfApprovedManifest } from '../../../../../selectors'
/*
MANIFESTS VIEW: Renders the budgets associated with a proposal, starting with the most recent (or approved) manifest
*/
@connect(state => ({
  manifests: state.db.proposal ? state.db.proposal.manifests : [],
  initialIndex: indexOfApprovedManifest(state),
  screen: state.screen
}))
class Manifests extends React.Component {
  static propTypes = {
    manifests: PropTypes.array,
    initialIndex: PropTypes.number,
    screen: PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = { index: props.initialIndex }
  }
  handleChange (value) {
    this.setState({ index: value })
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.initialIndex !== nextProps.initialIndex) {
      this.setState({ index: nextProps.initialIndex })
    }
  }
  render (
    { manifests, screen } = this.props,
    { index } = this.state
  ) {
    let manifest = manifests[index] || {}
    const columns = [
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
        // width: screen.greaterThan.medium ? 120 : 100,
        padding: 0
      },
      { title: 'Q',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 50
      }
    ]
    const footer = () => <span><h2>{`Grand Total: ${currency(manifest.total || 0)}`}</h2><h6>Tax Included in Calculation</h6></span>
    const dataSource = manifest.items || []
    return (
      <div>
        <h1>Budget</h1>
        {manifests.length > 1 &&
          <Alert type='info' banner showIcon={false}
            message='Multiple Budgets'
            description={<div>
              <p>
                This proposal has multiple manifests as a result of partial awards or supplementals. The most recent one has automatically been selected. Feel free to select another below.
              </p>
              <Select size='large' style={{ width: '100%' }}
                defaultValue={index.toString()}
                onChange={(value) => this.handleChange(value)}
              >
                {manifests.map((m, i) =>
                  <Option key={i} value={i.toString()}><h4>{`
                    ${m.title ? m.title : _.capitalize(m.type)}
                    ${m.author ? ` by ${m.author.name} - ` : ' - '}
                    ${m.decision ? m.decision.approved ? 'Approved' : 'Denied' : 'Proposed'}
                  `
                }</h4></Option>
                )}
              </Select>
            </div>
          } />
        }
        <Table dataSource={dataSource} sort
          size='middle'
          columns={columns}
          rowKey={record => record._id}
          //  The above will throw an error if using faker data, since duplicates are involved.
          expandedRowRender={screen.greaterThan.small ? expandedRowRender : false}
          defaultExpandAllRows={screen.greaterThan.small}
          pagination={false}
          footer={footer}
        />
      </div>
    )
  }
}

export default Manifests
