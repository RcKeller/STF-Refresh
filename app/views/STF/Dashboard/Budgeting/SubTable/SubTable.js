import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Row, Col, Table } from 'antd'

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
    render: (text, record) => <span>{text ? currency(record.tax ? text * record.tax : text) : 'n/a'}</span>,
    sorter: (a, b) => (a.price * a.tax) - (b.price * b.tax)
  }, {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity'
  }, {
    title: 'Subtotal',
    render: (text, record) => <span>{text ? currency(record.price * record.quantity) : '$0'}</span>,
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
  render: (text, record) => <span>{text ? currency(text) : '$0'}</span>,
  sorter: (a, b) => a.price - b.price
}, {
  title: 'Quantity',
  dataIndex: 'quantity',
  key: 'quantity',
  width: 90
}, {
  title: 'Subtotal',
  render: (text, record) => <span>{text ? currency(record.price * record.quantity) : '$0'}</span>,
  sorter: (a, b) => (a.price * a.quantity) - (b.price * b.quantity)
}
]

const contactColumns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  width: 200
}, {
  title: 'Title',
  dataIndex: 'title',
  key: 'title'
}, {
  title: 'NetID',
  dataIndex: 'netID',
  key: 'netID',
  width: 100
}, {
  title: 'Phone',
  dataIndex: 'phone',
  key: 'phone',
  width: 130
}, {
  title: 'Mail',
  dataIndex: 'mailbox',
  key: 'mailbox',
  width: 80
}]

class SubTable extends React.Component {
  static propTypes = {
    manifest: PropTypes.object,
    report: PropTypes.object
  }
  render (
    { contacts, manifest, report } = this.props
  ) {
    return (
      <div style={{ backgroundColor: '#fff' }}>
        <Row type='flex' justify='space-between' align='top'>
          <Col className='gutter-row' span={24} lg={report ? 12 : 24}>
            <h1>Award</h1>
            <h6>{`${_.capitalize(manifest.type)} - ${manifest.title || 'Untitled Award'}`}</h6>
            <Table id={manifest._id}
              columns={manifestColumns}
              rowKey={record => record._id}
              dataSource={manifest.items || []}
              size='middle'
              pagination={false}
              bordered={false}
            />
            <h2>{`Total: ${currency(manifest.total)}`}</h2>
            <p>{manifest.body || <em>No further information provided.</em>}</p>
          </Col>
          <Col className='gutter-row' span={24} lg={12}>
            {report
              ? <div>
                <h1>Expense Report</h1>
                <h6>{report.title}</h6>
                {Array.isArray(report.items) && report.items > 0 &&
                  <Table id={report._id}
                    columns={reportColumns}
                    rowKey={record => record._id}
                    dataSource={report.items || []}
                    size='middle'
                    pagination={false}
                    bordered={false}
                  />
                }
                {report.total && report.total > 0
                  ? <h2>{`Total: ${currency(report.total)}`}</h2>
                  : <h6><em>Legacy Report - no itemized expenses</em></h6>
                }
                <p>{report.body || <em>No further information provided.</em>}</p>
              </div>
              : <h1><em>No Reports Submitted</em></h1>
            }
          </Col>
        </Row>
        {Array.isArray(contacts) && contacts.length > 0
          ? <Table
            columns={contactColumns}
            rowKey={record => record._id}
            dataSource={contacts || []}
            size='middle'
            pagination={false}
            bordered={false}
          />
          : <h6><em>No contact info available.</em></h6>
        }
      </div>
    )
  }
}
/*

{<Collapse bordered={false} >
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
</Collapse>}
*/

export default SubTable
