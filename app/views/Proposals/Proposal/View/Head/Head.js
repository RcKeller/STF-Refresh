import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Alert } from 'antd'

import Status from './Status/Status'

/*
PROPOSAL HEAD:
Renders proposal "metadata" as you will
such as core contacts, award amounts, decisions etc
*/
// import styles from './Body.css'
@connect(state => ({
  id: state.db.proposal._id,
  title: state.db.proposal.title,
  organization: state.db.proposal.organization,
  year: state.db.proposal.year,
  number: state.db.proposal.number,
  uac: state.db.proposal.uac,
  fast: state.db.proposal.fast,
  contacts: state.db.proposal.contacts
}))
class Head extends React.Component {
  static propTypes = {
    contacts: PropTypes.array
  }
  render ({ id, title, organization, uac, fast, year, number, contacts, status } = this.props) {
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
            <Status />
          </Col>
        </Row>
      </section>
    )
  }
}

export default Head
