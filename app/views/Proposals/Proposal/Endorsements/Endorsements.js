import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col, Card } from 'antd'

import Endorse from './Endorse/Endorse'

// import styles from './Body.css'
@connect(state => ({
  proposalID: state.db.proposal._id,
  comments: state.db.proposal.comments,
  user: state.user,
  screen: state.screen
}))
class Endorsements extends React.Component {
  render ({ comments, user } = this.props) {
    return (
      <div>
        <h1>Community Endorsements</h1>
        <p>Anyone with a UW NetID can endorse a proposal! We highly encourage our proposal authors to exemplify their community engagement by having their proposals endorsed by students and staff alike. You may endorse as many proposals as you like.</p>
        <Row gutter={32}>
          {comments.map((c, i) =>
            <Col key={i} className='gutter-row' xs={24} md={12} xl={8} >
              <Card key={i} title={<h2>{c.user.name ? c.user.name : 'Endorsement'}</h2>}
                extra={c.user.netID}
              >
                <h4>{c.title}</h4>
                <p>{c.body}</p>
              </Card>
            </Col>
          )}
        </Row>
        <Endorse />
      </div>
    )
  }
}

Endorsements.propTypes = {
  comments: PropTypes.object
}
export default Endorsements
