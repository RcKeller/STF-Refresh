import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Link } from 'react-router'

import { Row, Col, Alert } from 'antd'
@connect(state => ({
  id: state.db.proposal._id,
  date: state.db.proposal.date
}))
class Update extends React.Component {
  render ({ id, date } = this.props) {
    return (
      <section>
        <Alert type='warning' showIcon banner
          message='Grace Period for Editing'
          description={<span>
            As part of regulatory compliance, the content of a proposal cannot be edited once it undergoes review. However, since a proposal is never reviewed during the week it was submitted, we've added a one-week grace period for authors to make revisions. <Link to={`/edit/${id}`}>Click here!</Link>
          </span>}
        />
        <h1>Update Contact Information</h1>
        <p>Update contact information here.</p>
      </section>
    )
  }
}

export default Update
