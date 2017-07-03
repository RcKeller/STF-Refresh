import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'

import { Row, Col, Spin, Progress, Collapse } from 'antd'
const Panel = Collapse.Panel

const capitalize = (word) => word[0].toUpperCase() + word.substr(1)

import styles from './Proposal.css'
@compose(
  connect(state => ({ proposal: state.entities.proposal })),
  connectRequest(props => api.get({
    model: 'proposal',
    query: {
      year: props.params.year,
      number: props.params.number
    },
    join: ['body', 'reviews', 'decision', 'contacts', 'manifests', 'report', 'amendments', 'comments']
  }))
)
class Proposal extends React.Component {
  render ({ proposal } = this.props) {
    return (
      <article className={styles['article']}>
        {!proposal
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
