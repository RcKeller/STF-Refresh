import React from 'react'
import PropTypes from 'prop-types'
// import _ from 'lodash'

import { Spin, Alert } from 'antd'

class Loading extends React.Component {
  static propTypes = {
    // Render goes through a truthiness check
    render: PropTypes.any.isRequired,
    // Component title and loading promp
    title: PropTypes.string,
    tip: PropTypes.string,
    // Alert type (change to error or info to change UI severity)
    type: PropTypes.string,
    // Timeout Interval
    timeout: PropTypes.number
  }
  static defaultProps = {
    render: false,
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
    if (error) {
      return (
        <Alert showIcon
          message={`Loading ${title} has failed`}
          description={info
            ? <div>
              <p>Try refreshing the page by pressing F5. If this error continues to occur, please notify our developer at STFCweb@uw.edu.</p>
              <hr />
              <pre>
                <small>
                  {`{ 'ERROR AT ${window && window.location && window.location.href}': [${JSON.stringify(error)}, ${JSON.stringify(info)}] }`}
                </small>
              </pre>
            </div>
            : 'An unknown error has occured.'
          }
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
