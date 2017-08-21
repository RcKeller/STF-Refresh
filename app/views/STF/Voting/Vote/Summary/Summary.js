import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Spin, Collapse } from 'antd'
const Panel = Collapse.Panel
@connect(
    //  Might seem counterintuitive, but we're connecting to a manifest and pulling its proposal data.
    (state, props) => ({
      body: state.db.manifests
        .find(manifest => manifest._id === props.id).proposal.body
    })
)
class Summary extends React.Component {
  render (
    { body } = this.props
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
                <Panel header={impactTitles[i]} key={i}>
                  <p>{body.overview.impact[area]}</p>
                </Panel>
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
      </section>
    )
  }
}
Summary.propTypes = {
  manifest: PropTypes.object,
  user: PropTypes.object
}
export default Summary
