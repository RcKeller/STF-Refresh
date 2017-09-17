import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Card } from 'antd'

import Endorse from './Endorse/Endorse'

// import styles from './Body.css'
@connect(state => ({
  proposalID: state.db.proposal._id,
  endorsements: state.db.proposal.comments,
  endorsed: state.db.proposal.comments
    .some(endorsement =>
      endorsement.user === state.user._id ||
      endorsement.user._id === state.user._id
    ),
  user: state.user,
  screen: state.screen
}))
class Endorsements extends React.Component {
  static propTypes = {
    endorsements: PropTypes.object
  }
  render ({ endorsements, endorsed, user } = this.props) {
    return (
      <div>
        <h1>Community Endorsements</h1>
        <h1 className='demo-note' style={{ color: 'goldenrod' }}>UP FOR DISCUSSION</h1>
        <p className='demo-note' style={{ color: 'goldenrod' }}>You can currently endorse your own proposal, but I can fix block contacts from the actual proposal from doing that. I don't see the point, though (say, a student lead or org head has something meaningful to say). Historically, I've seen department heads make really high quality endorsement messages.</p>
        <p>Anyone with a UW NetID can endorse a proposal! We highly encourage our proposal authors to exemplify their community engagement by having their proposals endorsed by students and staff alike. You may endorse as many proposals as you like.</p>
        <Row gutter={32}>
          {endorsements.map((c, i) =>
            <Col key={i} className='gutter-row' xs={24} md={12} xl={8} >
              <Card title={<h2>{c.user.name || 'Endorsement'}</h2>} extra={c.user.netID || ''}>
                {c.body}
              </Card>
            </Col>
          )}
        </Row>
        <hr />
        {endorsed
          ? <em>
            <h4>You have already endorsed this proposal.</h4>
            <span>Thank you for your feedback.</span>
          </em>
          : <Endorse />
        }
      </div>
    )
  }
}

export default Endorsements
