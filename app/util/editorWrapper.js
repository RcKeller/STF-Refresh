import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
// import 'bootstrap/dist/css/bootstrap.css';

class Wrapper extends React.Component {
  constructor (props) {
    super(props)
    this.handleValueChange = this.handleValueChange.bind(this)
    // this.disableContainerStyles = true
    this.state = { editorValue: props.value }
  }

    // disableContainerStyles = true

  getInputNode () {
    let domNode = ReactDOM.findDOMNode(this)
    if (domNode.tagName === 'INPUT') {
      return domNode
    }

    return domNode.querySelector('input:not([type=hidden])') || domNode
  }

  handleValueChange (value) {
    this.setState({ editorValue: value })
  }

  getValue () {
    return { [this.props.column.key]: this.state.editorValue }
  }

  render ({ WrappedEditor } = this.props) {
    return <WrappedEditor {...this.props} {...this.state} onValueChanged={this.handleValueChange} />
  }
}

const columnShape = {
  key: PropTypes.string.isRequired
}
// static propTypes = {
//    column: PropTypes.shape(columnShape).isRequired,
//    value: PropTypes.any
// }

const editorWrapper = WrappedEditor => <Wrapper WrappedEditor={WrappedEditor} />

export default editorWrapper
