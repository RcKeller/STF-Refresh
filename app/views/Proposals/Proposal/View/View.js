//  NOTE: This abstraction isn't necessary, but directories will be super cluttered without.
import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Spin } from 'antd'

import Head from './Head/Head'
import Overview from './Overview/Overview'
import Body from './Body/Body'
import Legacy from './Legacy/Legacy'
import Manifests from './Manifests/Manifests'

@connect(state => ({ proposal: state.db.proposal }))
class View extends React.Component {
  render ({ proposal } = this.props) {
    return (
      <div>
        {!proposal
          ? <Spin size='large' tip='Loading...' />
          : <div>
            <Head />
            {/* {!proposal.body.legacy ? <div><Overview /><Body /></div> : <Legacy />} */}
            <Overview />
            <Body />
            <Legacy />
            <Manifests />
          </div>
        }
      </div>
    )
  }
}
View.propTypes = {
  proposal: PropTypes.object
}
export default View
