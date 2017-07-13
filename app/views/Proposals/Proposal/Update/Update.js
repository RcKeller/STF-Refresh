import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Link } from 'react-router'

import { Row, Col, Alert } from 'antd'
@connect(state => ({
  id: state.entities.proposal._id,
  date: state.entities.proposal.date
}))
class Update extends React.Component {
  render ({ id, date } = this.props) {
    return (
      <section>
        <h1>Update</h1>
        <Row gutter={32}>
          <Col className='gutter-row' xs={24} md={12}>
            <p>Lorem Ipsum</p>
          </Col>
          <Col className='gutter-row' xs={24} md={12}>
            <Alert type='warning' showIcon
              message='Updates are limited'
              description='CYA stuff.'
            />
          </Col>
        </Row>
        <Alert type='warning' showIcon
          message='Grace Period for Editing'
          description={<span>
            As part of regulatory compliance, the content of a proposal cannot be edited once it undergoes review. However, since a proposal is never reviewed during the week it was submitted, we've added a one-week grace period for authors to make revisions. <Link to={`/edit/${id}`}>Click here!</Link>
          </span>}
        />
        <Alert type='error' showIcon
          message='Withdraw a Proposal'
          description={<span>
            If anything comes up, you may always withdraw a proposal, so long as it has not been voted on. We ask that you also let our proposal officer know ( STFagent@uw.edu ) why in these instances. To IRREVOCABLY withdraw this proposal and delete all of the data associated, <Link to={`/edit/${id}`}>Click here.</Link>
          </span>}
        />
      </section>
    )
  }
}

export default Update
