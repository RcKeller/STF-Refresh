import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

// import { Spin, Tabs } from 'antd'

//  Proposal components
import Head from './Head/Head'
import Overview from './Overview/Overview'
import Body from './Body/Body'
import Manifests from './Manifests/Manifests'

// import styles from './Proposal.css'
@connect(state => ({
  title: state.db.proposal.title,
  organization: state.db.proposal.organization,
  year: state.db.proposal.year,
  number: state.db.proposal.number
}))
class View extends React.Component {
  render ({ title, organization, year, number } = this.props) {
    return (
      <div>
        <h1>{title}</h1>
        <h3>For {organization}</h3>
        <h6>{`ID: ${year}-${number}`}</h6>
        <Head />
        <Overview />
        <hr />
        <Body />
        <hr />
        <Manifests />
      </div>
    )
  }
}

View.propTypes = {
  proposal: PropTypes.object
}
export default View
