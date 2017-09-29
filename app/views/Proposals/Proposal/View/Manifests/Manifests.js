import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { connect } from 'react-redux'

import { Table, Alert, Select } from 'antd'
const Option = Select.Option

const currency = value => `$${Number.parseInt(value).toLocaleString()}`

const expandedRowRender = record => record.description
  ? <div><h6>Description: </h6>{record.description}</div>
  : <em>No description provided.</em>

import { indexOfApprovedManifest } from '../../../../../selectors'

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
      { title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (text, record) => <span>{currency(record.tax ? record.price * record.tax : record.price)}</span>,
        sorter: (a, b) => a.price - b.price,
        width: screen.greaterThan.medium ? 120 : 80,
        padding: 0
      },
      { title: '#',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 50
      }
    ]
    const footer = () => <h2>{`Grand Total: ${currency(manifest.total || 0)}`}</h2>
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
          columns={screen.lessThan.medium ? columns.slice(0, 4) : columns}
          rowKey={record => record._id}
          //  The above will throw an error if using faker data, since duplicates are involved.
          expandedRowRender={screen.greaterThan.medium ? expandedRowRender : false}
          defaultExpandAllRows={screen.greaterThan.medium}
          pagination={false}
          footer={footer}
        />
      </div>
    )
  }
}

export default Manifests
