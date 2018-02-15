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

/*
PROPOSAL PAGE / VIEW:
Container for proposal content rendering
Conditially renders sections based on if the data is present
(e.g. renders Overview and Body for new format proposals)
*/
@connect(state => ({
  proposal: state.db.proposal._id,
  isLegacy: state.db.proposal.body
    ? state.db.proposal.body.legacy.length > 0
    : false,
  published: state.db.proposal.published,
  inReview: state.db.proposal.status === 'In Review'
}))
class View extends React.Component {
  static propTypes = {
    proposal: PropTypes.string,
    isLegacy: PropTypes.bool,
    published: PropTypes.bool
  }
  render ({ proposal, published, isLegacy, inReview } = this.props) {
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
                {inReview &&
                  <Alert type='warning' style={{ marginTop: 28 }}
                    banner showIcon={false}
                    message={<h3>Like this proposal?</h3>}
                    description={<span>Endorse it - <b>it could make the difference that gets this approved!</b> Use the endorsement tab at the top to leave your remarks.</span>}
                  />
                }
              </div>
            }
          </section>
          }
      </div>
    )
  }
}

export default View
