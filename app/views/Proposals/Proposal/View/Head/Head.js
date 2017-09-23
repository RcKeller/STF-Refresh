import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Collapse, Alert, Progress } from 'antd'
const Panel = Collapse.Panel

const capitalize = (word) => word[0].toUpperCase() + word.substr(1)
const currency = value => `$${Number.parseInt(value).toLocaleString()}`

// import styles from './Body.css'
@connect(state => ({
  screen: state.screen,
  id: state.db.proposal._id,
  title: state.db.proposal.title,
  organization: state.db.proposal.organization,
  year: state.db.proposal.year,
  number: state.db.proposal.number,
  uac: state.db.proposal.uac,
  contacts: state.db.proposal.contacts,
  status: state.db.proposal.status,
  decision: state.db.proposal.decision,
  supplementals: state.db.proposal.supplementals,
  asked: state.db.proposal.asked,
  received: state.db.proposal.received
}))
class Head extends React.Component {
  static propTypes = {
    contacts: PropTypes.array,
    status: PropTypes.string,
    decision: PropTypes.object
  }
  render ({ screen, id, title, organization, uac, year, number, contacts, status, decision, supplementals, asked, received } = this.props) {
    return (
      <section>
        <Row gutter={32} type='flex' justify='space-between' align='top' >
          <Col className='gutter-row' xs={24} md={12} lg={16} >
            <h1>{title}</h1>
            <h3>For {organization}</h3>
            <h6 id={id}>{`ID: ${year}-${number}`}</h6>
            {uac && <Alert type='warning' showIcon={false} banner
              style={{padding: '8px 0'}}
              message={<span><b>Tri-Campus</b>: This is a Universal Access Committe (UAC) proposal</span>}
            />}
            <hr />
            <ul>
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
            {received
              ? (screen.greaterThan.medium
                ? <div style={{ textAlign: 'right' }}>
                  <Progress
                    type='circle'
                    width={200}
                    percent={parseInt(received / asked * 100)}
                    format={percent => <span>
                      {currency(received)}
                      {/* <h6>{asked} {received}</h6> */}
                      <h5>{status}</h5>
                    </span>}
                   />
                </div>
                 : <Alert banner showIcon
                   type={received > 0 ? 'success' : 'error'}
                   message={<b>{received ? `${status} - ${currency(received)}` : status}</b>}
                   description={
                     <Progress
                       percent={parseInt(received / asked * 100)}
                     />

                   }
                 />
               )
              : <Alert banner showIcon
                type={status === 'Denied' ? 'warning' : 'info'}
                message={<span>
                  <b>Status: </b>
                  {status}
                </span>}
              />
            }
          </Col>
        </Row>
      </section>
    )
  }
}

export default Head
