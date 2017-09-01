import React from 'react'
import PropTypes from 'prop-types'

import EditorBase from './EditorBase'

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

export default SimpleText
