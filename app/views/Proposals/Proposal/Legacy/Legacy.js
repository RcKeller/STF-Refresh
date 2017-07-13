import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Alert } from 'antd'

@connect(state => ({ legacy: state.entities.proposal.body.legacy }))
class Legacy extends React.Component {
  render ({ legacy } = this.props) {
    return (
      <div>
        <h1>Proposal</h1>
        <Alert type='info' banner showIcon
          message='Legacy Format'
          description='Our proposal process has changed significantly since Summer 2017. To learn more about the current process, click here.'
        />
        {/* <Alert type='info' banner showIcon={false}
          message={<h1>Proposal</h1>}
          // message='This is a Legacy Proposal'
          description='Our proposal process has changed significantly since Summer 2017. This is an older proposal that is not representative of our current intake process. To learn more about the current process, click here.'
        /> */}
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

Legacy.propTypes = {
  legacy: PropTypes.object
}
export default Legacy
