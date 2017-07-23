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

EditorBase.propTypes = {
  onKeyDown: React.PropTypes.func, //  Possible bug - not always present
  value: React.PropTypes.any.isRequired,
  onBlur: React.PropTypes.func.isRequired,
  column: React.PropTypes.shape({
    name: React.PropTypes.node.isRequired,
    key: React.PropTypes.string.isRequired,
    width: React.PropTypes.number.isRequired,
    filterable: React.PropTypes.bool
  }).isRequired,
  commit: React.PropTypes.func //  Possible bug - not always present
}

class SimpleText extends EditorBase {
  ref = node => this.input = node
  render (
    { ref } = this,
    { onBlur, value } = this.props
  ) {
    return (
      <input type='text' className='form-control'
        ref={ref}
        defaultValue={value}
        onBlur={onBlur}
      />
    )
  }
}

export default EditorBase
export { SimpleText }
// export { default as SimpleText } from './SimpleText'
