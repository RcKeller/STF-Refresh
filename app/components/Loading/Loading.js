import React from 'react'
import PropTypes from 'prop-types'
// import _ from 'lodash'

import { Spin, Alert } from 'antd'

class Loading extends React.Component {
  static propTypes = {
    // loading: ,
    // Render
    title: PropTypes.string,
    tip: PropTypes.string,
    type: PropTypes.string,
    timeout: PropTypes.number
  }
  static defaultProps = {
    // render: false,
    tip: 'Loading...',
    title: 'this component',
    type: 'warning',
    timeout: 5000
  }
  state = { error: '', info: '' }
  componentDidMount () {
    setTimeout(this.requestTimedOut, this.props.timeout)
  }
  requestTimedOut = () => {
    const { render } = this.props
    if (!render) {
      // throw new Error('We were unable to find data on the server.')
      this.setState({ error: true, info: 'We were unable to find data on the server.' })
    }
  }
  componentDidCatch (error, info) {
    this.setState({ error, info })
  }
  render (
    { children, render, title, tip, type } = this.props,
    { error, info } = this.state
  ) {
    console.warn(render, error, info)
    if (error) {
      return (
        <Alert showIcon
          message={`Loading ${title} has failed`}
          description={'Further details about the context of this alert.'}
          type={type}
        />
      )
    } else if (!render) {
      return (
        <div style={{ width: '100%' }}>
          <Spin size='large' spinning
            tip={tip}
            // delay={500}
          />
        </div>
      )
    }
    return children
  }
}

export default Loading
