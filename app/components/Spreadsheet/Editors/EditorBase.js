import React from 'react'
import PropTypes from 'prop-types'

import ReactDOM from 'react-dom'
/*
BASE EDITOR for react-data-grid
This has been ripped from the official repo (which is not exactly ES6)
and has been refactored to support class syntax, destructuring, etc.
Every editor will extend this. SimpleText exists as an example editor that I've refactored.
*/
class EditorBase extends React.Component {
  static propTypes = {
    onKeyDown: PropTypes.func, //  Possible bug - not always present
    value: PropTypes.any.isRequired,
    onBlur: PropTypes.func.isRequired,
    column: PropTypes.shape({
      name: PropTypes.node.isRequired,
      key: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      filterable: PropTypes.bool
    }).isRequired,
    commit: PropTypes.func //  Possible bug - not always present
  }
  getStyle () {
    return {
      width: '100%'
    }
  }
  getValue () {
    let updated = {}
    updated[this.props.column.key] = this.getInputNode().value
    return updated
  }
  getInputNode () {
    let domNode = ReactDOM.findDOMNode(this)
    if (domNode.tagName === 'INPUT') {
      return domNode
    }
    return domNode.querySelector('input:not([type=hidden])')
  }
  inheritContainerStyles () {
    return true
  }
}

export default EditorBase
