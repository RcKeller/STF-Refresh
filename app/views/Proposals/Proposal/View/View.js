//  NOTE: This abstraction isn't necessary, but directories will be super cluttered without.
import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Spin, Alert } from 'antd'

import Head from './Head/Head'
import Overview from './Overview/Overview'
import Body from './Body/Body'
import Legacy from './Legacy/Legacy'
import Manifests from './Manifests/Manifests'

@connect(state => ({
  proposal: state.db.proposal._id,
  isLegacy: state.db.proposal.body.legacy.length > 0,
  published: state.db.proposal.published
}))
class View extends React.Component {
  render ({ proposal, published, isLegacy } = this.props) {
    //  Once the proposal has loaded, render it. Only render body if published.
    return (
      <div>
        {!proposal
          ? <Spin size='large' tip='Loading...' />
          : <section>
            <Head />
            {!published
              ? <Alert type='warning' showIcon
                message='Unpublished Proposal'
                description='This proposal has been withdrawn from publication by either an author or administrator. It exists for STF recordkeeping. For further inquiries, e-mail STFCweb@uw.edu'
              />
              : <div>
                {isLegacy ? <Legacy /> : <div><Overview /><hr /><Body /></div>}
                <hr />
                <Manifests />
              </div>
            }
          </section>
          }
      </div>
    )
  }
}
View.propTypes = {
  proposal: PropTypes.object
}
export default View
