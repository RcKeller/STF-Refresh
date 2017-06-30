import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest, querySelectors } from 'redux-query'

import api from '../../../services'

import { Row, Col, Spin, Progress, Collapse, Card } from 'antd'
const Panel = Collapse.Panel

const capitalize = (word) => word[0].toUpperCase() + word.substr(1)

const testContacts = [
  {
    role: 'primary',
    name: 'name',
    netID: 'id',
    title: 'title',
    email: 'email here',
    phone: 999,
    mailbox: 'addr'
  }
]
const query = (props) => ({
  model: 'block',
  query: { number: props.params.number },
  join: ['contacts', 'decision']
})

import styles from './block.css'
@compose(
  connect((state, props) => ({
    block: state.entities.block,
    loading: querySelectors.isPending(state.queries, api.get(query(props)))
  })),
  connectRequest((props) => api.get(query(props)))
)
class Block extends React.Component {
  render ({ block, loading } = this.props) {
    // let progressStatus = 'active'
    // if (block.decision) switch(true) {
    // // if (block.decision) switch(block.decision.approved) {
    //   case (true):
    //     progressStatus = 'success'
    //   case (false):
    //     progressStatus = 'exception'
    // }
    return (
      <article className={styles['article']}>
        {loading || !block
          ? <Spin size='large' tip='Loading...' />
          : <div>
            <Row type="flex" justify="space-between">
              <Col key='intro' xs={24} md={20} xl={22}>
                <h1>{block.title}</h1>
                <h2>For {block.organization}</h2>
              </Col>
              <Col key='meta' xs={24} md={4} xl={2}>
                <Progress type='circle' width={80}
                  status={block.decision ? (block.decision.approved ? 'success' : 'exception') : 'active'}
                  // status={block.decision && block.decision.approved ? 'success' : 'exception'}
                />
                <h5>Status: {block.status}</h5>
                <p>{`ID: ${block.year}-${block.number}`}</p>
              </Col>
            </Row>
            <Collapse>
              {testContacts.map((contact, i) => (
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
              <h2>Project Overview</h2>
              <p>{block.body.overview.abstract}</p>
              <h3>Objectives</h3>
              <p>{block.body.overview.objectives}</p>
            </section>
            <section>
              <h2>Ongoing Commitment</h2>
              <br />
              <h3>Services Provided</h3>
              <p>{block.body.plan.state}</p>
              <h3>Execution Strategy</h3>
              <p>{block.body.plan.strategy}</p>
              <h3>Risks and Mitigations</h3>
              <p>{block.body.plan.risk}</p>
            </section>
          </div>
        }
      </article>
    )
  }
}

Block.propTypes = {
  block: PropTypes.object
}
export default Block
