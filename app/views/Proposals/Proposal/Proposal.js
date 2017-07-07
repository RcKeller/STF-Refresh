import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'

import { Row, Col, Spin, Progress, Collapse, Icon, Tabs } from 'antd'
const Panel = Collapse.Panel
const TabPane = Tabs.TabPane

const capitalize = (word) => word[0].toUpperCase() + word.substr(1)

import styles from './Proposal.css'
@compose(
  connect(state => ({
    proposal: state.db.proposal,
    screen: state.screen
  })),
  connectRequest(props => api.get('proposals', {
    where: {
      year: props.params.year,
      number: props.params.number
    },
    join: ['body', 'decision', 'contacts', 'manifests', 'report', 'amendments', 'comments']
  }))
)
class Proposal extends React.Component {
  render ({ proposal, screen } = this.props) {
    //  className={styles['article']}
    return (
      <article className={styles['article']} >
        {!proposal
          ? <Spin size='large' tip='Loading...' />
          : <Tabs className='tab-container' type='card' >
              <TabPane className={styles['tab-pane']} tab='Proposal' key='1'>
              <Row type='flex' justify='space-between'>
                <Col key='intro' xs={24} md={20} xl={22}>
                  <h1>{proposal.title}</h1>
                  <h3>For {proposal.organization}</h3>

                  <h6>{`ID: ${proposal.year}-${proposal.number}`}</h6>
                </Col>
                <Col key='meta' xs={24} md={4} xl={2}>
                  {proposal.decision &&
                    <div>
                      <Progress type='circle' width={80}
                        status={proposal.decision ? (proposal.decision.approved ? 'success' : 'exception') : 'active'}
                        percent={100}
                      />
                      <h5>{proposal.status}</h5>
                    </div>
                  }
                </Col>
              </Row>
              <hr />
              <h5><em>Contact Information</em></h5>
              <Collapse bordered={false} >
                {proposal.contacts.map((contact, i) => (
                  <Panel key={i} header={<span>
                    {`${capitalize(contact.role)} Contact: `}
                    <em>{`${contact.name}, ${contact.title}`}</em>
                  </span>
                  }>
                    <ul>
                      <li>NetID: {contact.netID}</li>
                      <li>Email: {contact.email}</li>
                      <li>Phone: {contact.phone}</li>
                      <li>Mailbox: {contact.mailbox}</li>
                    </ul>
                  </Panel>
                ))}
              </Collapse>
              <section>
                <Row gutter={32}>
                  <Col className='gutter-row' xs={24} md={12}>
                    <h1>Project Overview</h1>
                    <p>{proposal.body.overview.abstract}</p>
                  </Col>
                  <Col className='gutter-row' xs={24} md={12}>
                    <h3>Objectives</h3>
                    <p>{proposal.body.overview.objectives}</p>
                    <h3>Core Justification</h3>
                    <p>{proposal.body.overview.justification}</p>
                  </Col>
                </Row>
                <h2>Impact</h2>
                <Row gutter={32}>
                  <Col className='gutter-row' xs={24} md={8}>
                    <h5><em>Academic Experience</em></h5>
                    <p>{proposal.body.overview.impact.academic}</p>
                  </Col>
                  <Col className='gutter-row' xs={24} md={8}>
                    <h5><em>Research Opportunities</em></h5>
                    <p>{proposal.body.overview.impact.research}</p>
                  </Col>
                  <Col className='gutter-row' xs={24} md={8}>
                    <h5><em>Career Development</em></h5>
                    <p>{proposal.body.overview.impact.career}</p>
                  </Col>
                </Row>
              </section>
              <hr />
              <h1>Project Plan</h1>
              <section>
                <h2>State Analysis</h2>
                <Row gutter={32}>
                  <Col className='gutter-row' xs={24} md={11}>
                    <h5><em>Current State</em></h5>
                    <p>{proposal.body.plan.state.current}</p>
                  </Col>
                  <Col className='gutter-row' xs={24} md={2}>
                    <Icon type={screen.greaterThan.medium ? 'right' : 'down'} className={styles['arrow']} />
                  </Col>
                  <Col className='gutter-row' xs={24} md={11}>
                    <h5><em>Future State</em></h5>
                    <p>{proposal.body.plan.state.future}</p>
                  </Col>
                </Row>
              </section>
              <section>
                <h2>Availability</h2>
                <Row gutter={32}>
                  <Col className='gutter-row' xs={24} md={11}>
                    <h5><em>Current Availability</em></h5>
                    <p>{proposal.body.plan.state.current}</p>
                  </Col>
                  <Col className='gutter-row' xs={24} md={2}>
                    <Icon type={screen.greaterThan.medium ? 'right' : 'down'} className={styles['arrow']} />
                  </Col>
                  <Col className='gutter-row' xs={24} md={11}>
                    <h5><em>Future Availability</em></h5>
                    <p>{proposal.body.plan.state.future}</p>
                  </Col>
                </Row>
              </section>
              <section>
                <h2>Implementation Strategy</h2>
                <Row gutter={32}>
                  <Col className='gutter-row' xs={24} md={11}>
                    <h5><em>Organizational Backing</em></h5>
                    <p>{proposal.body.plan.state.current}</p>
                  </Col>
                  <Col className='gutter-row' xs={24} md={2}>
                    <Icon type={screen.greaterThan.medium ? 'right' : 'down'} className={styles['arrow']} />
                  </Col>
                  <Col className='gutter-row' xs={24} md={11}>
                    <h5><em>Implementation Plan</em></h5>
                    <p>{proposal.body.plan.state.future}</p>
                  </Col>
                </Row>
              </section>
              <section>
                <h2>Outreach Efforts</h2>
                <Row gutter={32}>
                  <Col className='gutter-row' xs={24} md={11}>
                    <h5><em>Prior Outreach</em></h5>
                    <p>{proposal.body.plan.state.current}</p>
                  </Col>
                  <Col className='gutter-row' xs={24} md={2}>
                    <Icon type={screen.greaterThan.medium ? 'right' : 'down'} className={styles['arrow']} />
                  </Col>
                  <Col className='gutter-row' xs={24} md={11}>
                    <h5><em>Outreach Strategy</em></h5>
                    <p>{proposal.body.plan.state.future}</p>
                  </Col>
                </Row>
              </section>
              <section>
                <h2>Risk Assessment</h2>
                <Row gutter={32}>
                  <Col className='gutter-row' xs={24} md={11}>
                    <h5><em>Risk Factors</em></h5>
                    <p>{proposal.body.plan.state.current}</p>
                  </Col>
                  <Col className='gutter-row' xs={24} md={2}>
                    <Icon type={screen.greaterThan.medium ? 'right' : 'down'} className={styles['arrow']} />
                  </Col>
                  <Col className='gutter-row' xs={24} md={11}>
                    <h5><em>Mitigation Strategy</em></h5>
                    <p>{proposal.body.plan.state.future}</p>
                  </Col>
                </Row>
              </section>
              <section>
                <p>{JSON.stringify(proposal.amendments)}</p>
              </section>
              <section>
                <p>{JSON.stringify(proposal.manifests)}</p>
              </section>
              <hr />
              <section>
                <p>{JSON.stringify(proposal.comments)}</p>
              </section>
            </TabPane>
            <TabPane tab='Test' key='2'>
              <p>Test</p>
            </TabPane>
          </Tabs>
        }
      </article>
    )
  }
}

Proposal.propTypes = {
  proposal: PropTypes.object
}
export default Proposal
