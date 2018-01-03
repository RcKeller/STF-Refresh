import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeManifestByID } from '../../../../../selectors'

import { Spin, Table } from 'antd'

@connect(
    //  Might seem counterintuitive, but we're connecting to a manifest and pulling its proposal data.
    (state, props) => {
      const manifest = makeManifestByID(props.id)(state)
      return {
        manifest,
        screen: state.screen
      }
    }
)
class Endorsements extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    manifest: PropTypes.object,
    user: PropTypes.object
  }
  render (
    { screen, manifest } = this.props
  ) {
    const { proposal } = manifest
    console.log(proposal)
    return (
      <div>
        {!manifest
          ? <Spin size='large' tip='Loading...' />
          : <section>Endorsements</section>

        }
      </div>
    )
  }
}

export default Endorsements
