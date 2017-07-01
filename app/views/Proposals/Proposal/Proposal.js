import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest, querySelectors } from 'redux-query'

import api, { stub } from '../../../services'
// import stub from '../../../services/'

import { Row, Col, Spin, Progress, Collapse, Card } from 'antd'
const Panel = Collapse.Panel

const capitalize = (word) => word[0].toUpperCase() + word.substr(1)

//  Currently migrating DB's. Dummy to simulate join
const dummyContacts = [
  {
    role: 'primary',
    name: 'name',
    netID: 'id',
    title: 'title',
    email: 'email here',
    phone: 999,
    mailbox: 'addr'
  },
  {
    role: 'budget',
    name: 'name',
    netID: 'id',
    title: 'title',
    email: 'email here',
    phone: 999,
    mailbox: 'addr'
  }
]
const dummyDecision = {
  date: Date.now,
  //proposal
  body: 'Enjoy your money, etc.',
  //author
  approved: true,
  grant: 100000,
  //reviews
  //report

}

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
    //  Temp fix while DB migrates (joins aren't perfect)
    if (proposal) {
      proposal.contacts = dummyContacts
      proposal.decision = dummyDecision
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
                <Panel key={i} header={`${capitalize(contact.role)} Contact: ${contact.name}, ${contact.title}`}>
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
