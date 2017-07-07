import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Progress, Collapse } from 'antd'
const Panel = Collapse.Panel

const capitalize = (word) => word[0].toUpperCase() + word.substr(1)

// import styles from './Body.css'
@connect(state => ({
  contacts: state.db.proposal.contacts,
  status: state.db.proposal.status,
  decision: state.db.proposal.decision
}))
class Head extends React.Component {
  render ({ contacts, status, decision } = this.props) {
    return (
      <Row gutter={32}>
        <Col className='gutter-row' xs={24} md={12}>
          <Collapse bordered={false} >
            {contacts.map((c, i) => (
              <Panel key={i} header={
                <span>
                  {`${capitalize(c.role)} Contact: `}
                  <em>{`${c.name}, ${c.title}`}</em>
                </span>
              }>
                <ul>
                  <li>NetID: {c.netID}</li>
                  <li>Email: {c.email}</li>
                  <li>Phone: {c.phone}</li>
                  <li>Mailbox: {c.mailbox}</li>
                </ul>
              </Panel>
            ))}
          </Collapse>
        </Col>
        <Col className='gutter-row' xs={24} md={12}>
          <h5>Status: {status}</h5>
          {decision &&
            <Progress type='circle' width={80}
              status={decision ? (decision.approved ? 'success' : 'exception') : 'active'}
              percent={100}
            />
          }
        </Col>
      </Row>
    )
  }
}

Head.propTypes = {
  contacts: PropTypes.object,
  status: PropTypes.string,
  decision: PropTypes.object
}
export default Head
