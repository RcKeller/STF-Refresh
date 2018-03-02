import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { Link } from 'react-router'

import { Alert } from 'antd'
/*
PROPOSAL BODY (LEGACY FORMAT):
Maps over an array of legacy content fields, mapping headers and bodies
NOTE: the legacy format is exactly the same as the last website
*/
@connect(state => ({
  legacy: state.db.proposal.body
  ? state.db.proposal.body.legacy
  : [],
  rfp: state.config.links.rfp
}))
class Legacy extends React.Component {
  static propTypes = {
    legacy: PropTypes.array
  }
  render ({ legacy, rfp } = this.props) {
    console.log(rfp)
    return (
      <div>
        <Alert type='info' banner showIcon
          style={{ marginTop: -8 }}
          message={<div>
            Our proposal process has changed significantly since Summer 2017.
            <a style={{ float: 'right' }} href={rfp}>Learn More</a>
          </div>
          }
        />
        {Array.isArray(legacy) && legacy.map((e, i) =>
          <div key={i}>
            {e.title === 'Abstract' || e.title === 'Background'
              ? <h2>{e.title}</h2>
              : <h3>{e.title}</h3>
            }
            <p>{e.body}</p>
          </div>
        )}
      </div>
    )
  }
}

export default Legacy
