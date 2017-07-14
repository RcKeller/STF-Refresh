import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Collapse, Alert } from 'antd'
const Panel = Collapse.Panel

const capitalize = (word) => word[0].toUpperCase() + word.substr(1)

// import styles from './Body.css'
@connect(state => ({
  title: state.db.proposal.title,
  organization: state.db.proposal.organization,
  year: state.db.proposal.year,
  number: state.db.proposal.number,
  uac: state.db.proposal.uac,
  contacts: state.db.proposal.contacts,
  status: state.db.proposal.status,
  decision: state.db.proposal.decision,
  amendments: state.db.proposal.amendments
}))
class Head extends React.Component {
  render ({ title, organization, uac, year, number, contacts, status, decision, amendments } = this.props) {
    return (
      <section>
        <Row gutter={32}>
          <Col className='gutter-row' xs={24} md={12} lg={16} >
            <h1>{title}</h1>
            <h3>For {organization}</h3>
            <h6>{`ID: ${year}-${number}`}</h6>
            {uac && <Alert showIcon={false} type='warning' style={{paddingLeft: 0}}
              message={<span><b>Tri-Campus</b>: This is a Uniform Access Committe (UAC) proposal</span>}
            />}
          </Col>
          <Col className='gutter-row' xs={24} md={12} lg={8} >
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
        </Row>
        {decision
          ? <Alert type={decision.approved ? 'success' : 'error'} showIcon
            message={<b>Proposal {decision.approved ? 'Approved' : 'Rejected'}</b>}
            description={<span>
              <h6>Author: {decision.author.name} | {decision.date}</h6>
              <p>{decision.body}</p>
            </span>}
          />
          : <Alert type='info' showIcon banner
            message={`Status: ${status}`}
            description='Lorem Ipsum'
          />
        }

      </section>
    )
  }
}
/*
{decision &&
  <Progress type='circle' width={80}
    status={decision ? (decision.approved ? 'success' : 'exception') : 'active'}
    percent={100}
  />
}
*/
Head.propTypes = {
  contacts: PropTypes.object,
  status: PropTypes.string,
  decision: PropTypes.object
}
export default Head
