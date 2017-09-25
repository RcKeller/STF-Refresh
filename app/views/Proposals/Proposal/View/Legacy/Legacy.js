import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { Link } from 'react-router'

import { Alert } from 'antd'

@connect(state => ({
  legacy: state.db.proposal.body
  ? state.db.proposal.body.legacy
  : []
}))
class Legacy extends React.Component {
  static propTypes = {
    legacy: PropTypes.array
  }
  render ({ legacy } = this.props) {
    return (
      <div>
        <h1>Proposal</h1>
        <Alert type='info' banner showIcon
          message={<span>
            Our proposal process has changed significantly since Summer 2017.
          </span>
        }
          closeText={<Link to='/create'>Learn More</Link>}
        />
        {Array.isArray(legacy) && legacy.map((e, i) =>
          <div key={i}>
            {e.title === 'Abstract' || e.title === 'Background'
              ? <h2>{e.title}</h2>
              : <h3>{e.title}</h3>
            }
            <p>{e.body}</p>
            {/* <p>
              <b>{e.body.split(':')[0]}</b>
              <span>{e.body.split(':')[1]}</span>
            </p> */}
          </div>
        )}
      </div>
    )
  }
}

export default Legacy
