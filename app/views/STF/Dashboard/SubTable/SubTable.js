import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Row, Col, Table, Collapse } from 'antd'
const Panel = Collapse.Panel

const currency = number =>
  number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })

const manifestColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (text, record) => <span>{currency(text * record.tax)}</span>,
    sorter: (a, b) => (a.price * a.tax) - (b.price * b.tax)
  }, {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity'
  }, {
    title: 'Subtotal',
    render: (text, record) => <span>{currency(record.price * record.quantity) || '$0'}</span>,
    sorter: (a, b) => (a.price * a.quantity) - (b.price * b.quantity)
  }
]

const reportColumns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name'
}, {
  title: 'Vendor',
  dataIndex: 'vendor',
  key: 'vendor'
}, {
  title: 'Price',
  dataIndex: 'price',
  key: 'price',
  render: (text, record) => <span>{currency(text) || '$0'}</span>,
  sorter: (a, b) => a.price - b.price,
}, {
  title: 'Quantity',
  dataIndex: 'quantity',
  key: 'quantity',
  width: 90
}, {
  title: 'Subtotal',
  render: (text, record) => <span>{currency(record.price * record.quantity) || '$0'}</span>,
  sorter: (a, b) => (a.price * a.quantity) - (b.price * b.quantity),
}
]

// const expandedRowRender = record => <p><h6>Description: </h6>{record.description}</p>

class SubTable extends React.Component {
  render (
    { contacts, manifest, report } = this.props
  ) {
    return (
      <div>
      <Row type="flex" justify="space-between" align="bottom">
        <Col className='gutter-row' span={24} lg={12}>
          <h2>Award</h2>
          <h6><em>{`${_.capitalize(manifest.type)} Proposal`}</em></h6>
          <h5>{manifest.title}</h5>
          <p>{manifest.body}</p>
        </Col>
        <Col className='gutter-row' span={24} lg={12}>
          {report &&
            <div>
              <h2>Expenditures</h2>
              <h5>{report.title}</h5>
              <p>{report.body}</p>
            </div>
          }
        </Col>
      </Row>
        {/* <Collapse bordered={false} >
          {contacts.map((c, i) => (
            <Panel key={i} header={
              <span>
                {`${_.capitalize(c.role)} Contact: `}
                <em>{`${c.name}, ${c.title}`}</em>
              </span>
            }>
              <ul>
                <li>NetID: {c.netID}</li>
                <li>Phone: {c.phone}</li>
                <li>Mailbox: {c.mailbox}</li>
              </ul>
            </Panel>
          ))}
        </Collapse> */}
        <Row type="flex" justify="space-between" align="bottom">
          <Col className='gutter-row' span={24} lg={12}>
            <Table id={manifest._id}
              columns={manifestColumns}
              dataSource={manifest.items || []}
              size='small'
              pagination={false}
              bordered={false}
            />
          </Col>
          {report
            ? <Col className='gutter-row' span={24} lg={12}>
              <Table id={report._id}
                columns={reportColumns}
                dataSource={report.items || []}
                size='small'
                pagination={false}
                bordered={false}
              />
            </Col>
            : <em>The author has not reported any expenditures.</em>
          }
        </Row>
      </div>
    )
  }
}

SubTable.propTypes = {
  manifest: PropTypes.object,
  report: PropTypes.object
}
export default SubTable
