import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Spin, Collapse, Table } from 'antd'
const Panel = Collapse.Panel

const columns = [
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
    sorter: (a, b) => (a.priority) - (b.priority),
    width: 90
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  { title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (text, record) => <span>{`${record.price} x ${record.tax}`}</span>,
    sorter: (a, b) => (a.price * a.tax) - (b.price * b.tax),
    width: 120
  },
  { title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 90
  }
]

const expandedRowRender = record => record.description
  ? <div><h6>Description: </h6>{record.description}</div>
  : <em>No description provided.</em>

@connect(
    //  Might seem counterintuitive, but we're connecting to a manifest and pulling its proposal data.
    (state, props) => ({
      body: state.db.manifests
        .find(manifest => manifest._id === props.id).proposal.body || {},
      manifest: state.db.manifests
        .find(manifest => manifest._id === props.id) || {},
      items: state.db.manifests
        .find(manifest => manifest._id === props.id).items || []
    })
)
class Summary extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    manifest: PropTypes.object,
    user: PropTypes.object
  }
  render (
    { body, manifest } = this.props
  ) {
    //  For reasons unknown, we can't use Object.keys to iterate and create panels. Map works though. Perhaps it's a FP issue?
    const impactKeys = Object.keys(body.overview.impact)
    const impactTitles = ['Academic Experience', 'Research Opportunities', 'Career Development']
    const planKeys = Object.keys(body.plan)
    const planTitles = ['State Analysis', 'Availability', 'Implementation Strategy', 'Outreach Efforts', 'Risk Assessment']
    return (
      <section>
        {!body
          ? <Spin size='large' tip='Loading...' />
          : <div>
            <Row gutter={32}>
              <Col className='gutter-row' xs={24} md={12}>
                <h1>Overview</h1>
                <p>{body.overview.abstract}</p>
              </Col>
              <Col className='gutter-row' xs={24} md={12}>
                <h3>Objectives</h3>
                <p>{body.overview.objectives}</p>
                <h3>Core Justification</h3>
                <p>{body.overview.justification}</p>
              </Col>
            </Row>
            <h2>Impact</h2>
            <Collapse bordered={false} defaultActiveKey={['0', '1', '2']}>
              {impactKeys.map((area, i) => (
                <div key={i}>
                  <h6>{impactTitles[i]}</h6>
                  <p>{body.overview.impact[area]}</p>
                </div>
              ))}
            </Collapse>
            <h1>Project Plan</h1>
            <Collapse bordered={false} >
              {planKeys.map((area, i) => (
                <Panel header={planTitles[i]} key={i}>
                  <h3>Current</h3>
                  <p>{body.plan[area].current}</p>
                  <h3>Future</h3>
                  <p>{body.plan[area].future}</p>
                </Panel>
              ))}
            </Collapse>
          </div>
          }
        {manifest && manifest.type === 'supplemental' &&
        <div>
          <h1>Supplemental Information</h1>
          <h3>{manifest.title || 'Untitled Supplemental'}</h3>
          <p>{manifest.body || 'No information provided by the author'}</p>
        </div>
        }
        <h1>Proposed Budget</h1>
        {!manifest
          ? <Spin size='large' tip='Loading...' />
          : <Table dataSource={manifest.items || []} sort
            size='middle'
            columns={columns}
            rowKey={record => record._id}
            //  The above will throw an error if using faker data, since duplicates are involved.
            expandedRowRender={expandedRowRender}
            pagination={false}
          />
        }
      </section>
    )
  }
}

export default Summary
