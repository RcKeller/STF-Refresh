import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Alert, Progress } from 'antd'

// const capitalize = (word) => word[0].toUpperCase() + word.substr(1)
const currency = value => `$${Number.parseInt(value).toLocaleString()}`

import { proposalDecision } from '../../../../../selectors'

// import styles from './Body.css'
@connect(state => ({
  screen: state.screen,
  id: state.db.proposal._id,
  title: state.db.proposal.title,
  organization: state.db.proposal.organization,
  year: state.db.proposal.year,
  number: state.db.proposal.number,
  uac: state.db.proposal.uac,
  fast: state.db.proposal.fast,
  contacts: state.db.proposal.contacts,
  status: state.db.proposal.status,
  decision: proposalDecision(state),
  asked: state.db.proposal.asked,
  received: state.db.proposal.received
}))
class Head extends React.Component {
  static propTypes = {
    contacts: PropTypes.array,
    status: PropTypes.string,
    decision: PropTypes.object
  }
  render ({ screen, id, title, organization, uac, fast, year, number, contacts, status, decision, asked, received } = this.props) {
    return (
      <section>
        <Row gutter={32} type='flex' justify='space-between' align='top' >
          <Col className='gutter-row' xs={24} md={12} lg={16} >
            <h1>{title}</h1>
            <h3>For {organization}</h3>
            <h6 id={id}>{`ID: ${year}-${number}`}</h6>
            {uac && <Alert type='warning' showIcon={false} banner
              message={<span><b>Tri-Campus</b>: This is a tri-campus project reviewed by the Universal Access Committe (UAC)</span>}
            />}
            {fast && <Alert type='warning' showIcon={false} banner
              message={<span><b>Fast Track</b>: This proposal was Fast-Tracked - a former process for expediting review</span>}
            />}
            <hr />
            <ul style={{
              listStyleType: 'disc',
              listStylePosition: 'inside'
            }}>
              {contacts.map((c, i) => (
                <li key={i}>
                  <b>{`${c.role[0].toUpperCase() + c.role.slice(1)} Contact: `}</b>
                  <span>{`${c.name} (${c.netID}) - `}</span>
                  <em>{c.title}</em>
                </li>
              ))}
            </ul>
            <hr />
          </Col>
          <Col className='gutter-row' xs={24} md={12} lg={8}>
            {typeof decision.approved === 'boolean'
              ? (decision.approved
                  ? (screen.greaterThan.medium
                    ? <div style={{ textAlign: 'right' }}>
                      <Progress
                        type='circle'
                        width={200}
                        percent={parseInt(received / asked * 100)}
                        format={percent => <span>
                          {currency(received)}
                          <h5>{status}</h5>
                        </span>}
                       />
                    </div>
                     : <Alert banner showIcon
                       type={received > 0 ? 'success' : 'error'}
                       message={<b>{received ? `${status} - ${currency(received)}` : status}</b>}
                       description={<div>
                         <Progress
                           percent={parseInt(received / asked * 100)}
                         />
                         <span>{decision.body}</span>
                       </div>
                       } />
                   )
                 : <Alert banner showIcon type='error'
                   message={<b>{status}</b>}
                   description={decision.body || 'Unfortunately, this proposal was denied by the committee. Decisions are issued based on student need and benefits. Authors are welcome to propose partial / alternative budgets or suggest a new project in the next cycle.'}
                  />
               )
               : <Alert banner showIcon type='info'
                 message={<b>{status}</b>}
                 description='The committee has not issued a decision at this time.'
               />
           }
          </Col>
        </Row>
      </section>
    )
  }
}

export default Head
