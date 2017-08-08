import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../services'

import { Spin } from 'antd'
// @connect(state => ({ user: state.user }))
@connect(
    //  Might seem counterintuitive, but we're connecting to
    (state, props) => ({
      manifest: state.db.manifests[props.index],
      proposal: state.db.manifests[props.index].proposal
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
            {uac && <span><h2>Universal Access Committee</h2><hr /></span>}
            <h1>{title}</h1>
            <h3>For {organization}</h3>
            <h6 id={id}>{`ID: ${year}-${number}`}</h6>
          </div>
        }
      </section>
    )
  }
}
Vote.propTypes = {
  proposal: PropTypes.object
}
export default Vote
