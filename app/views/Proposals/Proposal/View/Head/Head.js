import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Collapse, Alert } from 'antd'
const Panel = Collapse.Panel

const capitalize = (word) => word[0].toUpperCase() + word.substr(1)

// import styles from './Body.css'
@connect(state => ({
  id: state.db.proposal._id,
  title: state.db.proposal.title,
  organization: state.db.proposal.organization,
  year: state.db.proposal.year,
  number: state.db.proposal.number,
  uac: state.db.proposal.uac,
  contacts: state.db.proposal.contacts,
  status: state.db.proposal.status,
  decision: state.db.proposal.decision,
  supplementals: state.db.proposal.supplementals
}))
class Head extends React.Component {
  render ({ id, title, organization, uac, year, number, contacts, status, decision, supplementals } = this.props) {
    return (
      <section>
        <Row gutter={32} type='flex' justify='space-between' align='middle' >
          <Col className='gutter-row' xs={24} md={12} lg={16} >
            <h1>{title}</h1>
            <h3>For {organization}</h3>
            <h6 id={id}>{`ID: ${year}-${number}`}</h6>
            {uac && <Alert type='warning' showIcon={false} banner
              style={{padding: '8px 0'}}
              message={<span><b>Tri-Campus</b>: This is a Universal Access Committe (UAC) proposal</span>}
            />}
            {decision
              ? <Alert type={decision.approved ? 'success' : 'error'} showIcon={false}
                message={<b>Proposal {decision.approved ? 'Approved' : 'Rejected'}</b>}
                description={<span>
                  <h6>Author: {decision.author.name} | {decision.date}</h6>
                  <p>{decision.body}</p>
                </span>}
              />
              : <Alert type='info' showIcon={false} banner
                message={`Status: ${status}`}
                description='Lorem Ipsum'
              />
            }
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
                    <li>Phone: {c.phone}</li>
                    <li>Mailbox: {c.mailbox}</li>
                  </ul>
                </Panel>
              ))}
            </Collapse>
          </Col>
        </Row>
      </section>
    )
  }
}
Head.propTypes = {
  contacts: PropTypes.object,
  status: PropTypes.string,
  decision: PropTypes.object
}
export default Head
