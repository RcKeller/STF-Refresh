import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../services'

import { Spin } from 'antd'
/*
There are two kinds of meetings:
- QA meetings (metrics, no votes)
- Voting meetings (votes, may have metrics but probably not)
*/
@connect(
    //  Might seem counterintuitive, but we're connecting to a manifest and pulling its proposal data.
    (state, props) => ({
      manifest: state.db.manifests[props.index],
      user: state.user
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
)
class Vote extends React.Component {
  render (
    { manifest } = this.props
  ) {
    const { proposal } = manifest
    const { id, title, organization, uac, year, number } = proposal
    return (
      <section>
        {!proposal
          ? <Spin size='large' tip='Loading...' />
          : <div>
            <h1>{uac ? title : `${title} (UAC)`}</h1>
            {uac && <h2>Universal Access Committee</h2>}
            <h3>For {organization}</h3>
            <h6 id={id}>{`ID: ${year}-${number}`}</h6>
          </div>
        }
      </section>
    )
  }
}
Vote.propTypes = {
  manifest: PropTypes.object,
  user: PropTypes.object
}
export default Vote
