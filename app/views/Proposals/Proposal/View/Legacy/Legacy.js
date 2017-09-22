import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Alert } from 'antd'

@connect(state => ({ legacy: state.db.proposal.body.legacy || [] }))
class Legacy extends React.Component {
  // static propTypes = {
  //   legacy: PropTypes.object
  // }
  render ({ legacy } = this.props) {
    return (
      <div>
        <h1>Proposal</h1>
        <Alert type='info' banner showIcon={false}
          message='Legacy Format'
          description='Our proposal process has changed significantly since Summer 2017. To learn more about the current process, click here.'
        />
        {legacy.map((e, i) =>
          <div key={i}>
            <h5><em>{e.title}</em></h5>
            <p>{e.body}</p>
          </div>
        )}
      </div>
    )
  }
}

export default Legacy
