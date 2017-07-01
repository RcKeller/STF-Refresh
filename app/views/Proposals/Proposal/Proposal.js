import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest, querySelectors } from 'redux-query'

import api, { stub } from '../../../services'

import { Row, Col, Spin, Progress, Collapse } from 'antd'
const Panel = Collapse.Panel

const capitalize = (word) => word[0].toUpperCase() + word.substr(1)

import styles from './Proposal.css'
const query = (props) => ({
  model: 'proposal',
  query: {
    year: props.params.year,
    number: props.params.number
  },
  join: ['body', 'decision', 'contacts', 'manifests', 'reports', 'amendments', 'comments']
})
@compose(
  connect((state, props) => ({
    proposal: state.entities.proposal,
    loaded: querySelectors.isPending(state.queries, api.get(query(props)))
  })),
  connectRequest((props) => api.get(query(props)))
)
class Proposal extends React.Component {
  render ({ proposal, loading } = this.props) {
    //  Add stub data to simulate joins as DB issues are resolved.
    if (proposal) {
      proposal.contacts = [stub.contact, stub.contact, stub.contact, stub.contact]
      proposal.body = stub.project
      proposal.manifests = [stub.manifest, stub.manifest]
      proposal.amendments = [stub.amendment]
      proposal.report = stub.report
      proposal.decision = stub.decision
      proposal.comments = [stub.comment, stub.comment]
      console.log('Populated w/ stub data:', proposal)
    }
    return (
      <article className={styles['article']}>
        {loading || !proposal
          ? <Spin size='large' tip='Loading...' />
          : <div>
            <Row type='flex' justify='space-between'>
              <Col key='intro' xs={24} md={20} xl={22}>
                <h1>{proposal.title}</h1>
                <h2>For {proposal.organization}</h2>
              </Col>
              <Col key='meta' xs={24} md={4} xl={2}>
                {proposal.decision &&
                  <Progress type='circle' width={80}
                    status={proposal.decision ? (proposal.decision.approved ? 'success' : 'exception') : 'active'}
                    percent={100}
                  />
                }
                <h5>Status: {proposal.status}</h5>
                <p>{`ID: ${proposal.year}-${proposal.number}`}</p>
              </Col>
            </Row>
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
                  <h2>Project Overview</h2>
                  <p>{proposal.body.overview.abstract}</p>
                </Col>
                <Col className='gutter-row' xs={24} md={12}>
                  <h3>Objectives</h3>
                  <p>{proposal.body.overview.objectives}</p>
                  <h3>Core Justification</h3>
                  <p>{proposal.body.overview.justification}</p>
                </Col>
              </Row>
              <h2>Student Impact</h2>
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
            <section>
              <p>{JSON.stringify(proposal.body)}</p>
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
          </div>
        }
      </article>
    )
  }
}

Proposal.propTypes = {
  proposal: PropTypes.object
}
export default Proposal
