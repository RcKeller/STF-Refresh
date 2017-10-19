import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Card, Collapse } from 'antd'
const Panel = Collapse.Panel

import Endorse from './Endorse/Endorse'

// import styles from './Body.css'
@connect(state => ({
  proposalID: state.db.proposal._id,
  endorsements: state.db.proposal.comments,
  endorsed: state.db.proposal.comments
    .some(endorsement =>
      endorsement.user._id === state.user._id
    ),
  decisionIssued: state.db.proposal.manifests
    .findIndex(m => m.decision && typeof m.decision.approved === 'boolean') >= 0,
  user: state.user,
  screen: state.screen
}))
class Endorsements extends React.Component {
  static propTypes = {
    endorsements: PropTypes.array
  }
  render ({ endorsements, endorsed, decisionIssued, user } = this.props) {
    return (
      <div>
        <h1>Community Endorsements</h1>
        <p>Anyone with a UW NetID can endorse a proposal! We highly encourage our proposal authors to exemplify their community engagement by having their proposals endorsed by students and staff alike. You may endorse as many proposals as you like.</p>
        {endorsed
          ? <em>
            <h4>You have already endorsed this proposal.</h4>
            <span>Thank you for your feedback.</span>
          </em>
          : (!decisionIssued
            ? <Endorse />
            : <h4>This proposal cannot be endorsed after a committee decision.</h4>
          )
        }
        {endorsements && <hr />}
        <Collapse bordered={false} defaultActiveKey={endorsements ? Object.keys(endorsements) : '0'}>
          {endorsements.map((c, i) => (
            <Panel key={i}
              header={<b>{c.user.name || 'Endorsement'}</b>}
              extra={c.user.netID || ''}
              >
              <p>{c.body}</p>
            </Panel>
          ))}
        </Collapse>
      </div>
    )
  }
}

export default Endorsements
