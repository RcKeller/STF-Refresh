import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Row, Col, Spin, Alert, Collapse } from 'antd'
const Panel = Collapse.Panel

@connect(
    //  Might seem counterintuitive, but we're connecting to a manifest and pulling its proposal data.
    (state, props) => ({
      body: state.db.manifests
        .find(manifest => manifest._id === props.id).proposal.body || {},
      isLegacy: state.db.manifests
        .find(manifest => manifest._id === props.id).proposal.body.legacy.length > 0,
      manifest: state.db.manifests
        .find(manifest => manifest._id === props.id) || {},
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
    const impactTitles = ['Academic Impact', 'Research Opportunities', 'Career Development']
    const planKeys = body.plan ? Object.keys(body.plan) : []
    const planTitles = ['State Analysis', 'Availability', 'Implementation Strategy', 'Outreach Efforts', 'Risk Assessment']
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
                <Collapse bordered={false} defaultActiveKey={['0', '1', '2']}>
                  {impactKeys.map((area, i) => (
                    <div key={i}>
                      <h4>{impactTitles[i]}</h4>
                      <p>{body.overview.impact[area]}</p>
                    </div>
                  ))}
                </Collapse>
                <h1>Project Plan</h1>
                <Collapse bordered={false} >
                  {planKeys.map((area, i) => (
                    <Panel header={planTitles[i]} key={i}>
                      <h5>Current</h5>
                      <p>{body.plan[area].current}</p>
                      <h5>Future</h5>
                      <p>{body.plan[area].future}</p>
                    </Panel>
                  ))}
                </Collapse>
              </section>
            : <div>
              <Alert type='info' banner showIcon
                message='Legacy Proposal - No Project Plan'
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
      </section>
    )
  }
}

export default Summary
