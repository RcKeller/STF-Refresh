import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const currency = number =>
  number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })

import { Row, Col, Spin, Alert, Collapse, Table } from 'antd'
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
    key: 'name',
    render: text => <h5>{text}</h5>
  },
  { title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (text, record) => <span>{currency(record.tax ? record.price * record.tax : record.price)}</span>,
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
      isLegacy: state.db.manifests
        .find(manifest => manifest._id === props.id).proposal.body.legacy.length > 0,
      manifest: state.db.manifests
        .find(manifest => manifest._id === props.id) || {},
      items: state.db.manifests
        .find(manifest => manifest._id === props.id).items || [],
      screen: state.screen
    })
)
class Summary extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    manifest: PropTypes.object,
    user: PropTypes.object
  }
  render (
    { screen, body, isLegacy, manifest } = this.props
  ) {
    //  For reasons unknown, we can't use Object.keys to iterate and create panels. Map works though. Perhaps it's a FP issue?
    const impactKeys = body.overview ? Object.keys(body.overview.impact) : []
    const impactTitles = ['Academic Experience', 'Research Opportunities', 'Career Development']
    const planKeys = body.plan ? Object.keys(body.plan) : []
    const planTitles = ['State Analysis', 'Availability', 'Implementation Strategy', 'Outreach Efforts', 'Risk Assessment']
    const footer = () => <h2>{`Grand Total: ${currency(manifest.total)}`}</h2>
    return (
      <section>
        {!body
          ? <Spin size='large' tip='Loading...' />
          : <div>
            {!isLegacy
              ? <section>
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
              </section>
            : <div>
              <Alert type='info' banner showIcon={false}
                message='Legacy Format'
                description='Our proposal process has changed significantly since Summer 2017. To learn more about the current process, click here.'
              />
              <div>
                {body.legacy && body.legacy.map((e, i) =>
                  <div key={i}>
                    {e.title === 'Abstract' || e.title === 'Background'
                      ? <h2>{e.title}</h2>
                      : <h4>{e.title}</h4>
                    }
                    <p>{e.body}</p>
                  </div>
                )}
              </div>
            </div>
          }
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
            expandedRowRender={screen.greaterThan.medium ? expandedRowRender : false}
            defaultExpandAllRows={screen.greaterThan.medium}
            pagination={false}
            footer={footer}
          />
        }
      </section>
    )
  }
}

export default Summary
