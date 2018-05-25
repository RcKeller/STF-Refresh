import React from 'react'
import PropTypes from 'prop-types'

import { Alert } from 'antd'

class Loading extends React.Component {
  static propTypes = { title: PropTypes.string }
  static defaultProps = { title: 'this component' }
  state = { error: '', info: '' }
  componentDidCatch (error, info) {
    this.setState({ error, info })
  }
  render (
    { children, title } = this.props,
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
                  {`{ 'ERROR AT ${window && window.location && window.location.href}': ${JSON.stringify(info)} }`}
                </small>
              </pre>
            </div>
            : 'An unknown error has occured.'
          }
          type={type}
        />
      )
    }
    return children
  }
}

export default Loading
