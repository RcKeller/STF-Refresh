import React from 'react'
import PropTypes from 'prop-types'

import EditorBase from './EditorBase'

class SimpleNumber extends EditorBase {
  getValue () {
    let updated = super.getValue()
    //  Multiple values can be updated. Cast all object props to ints.
    Object.keys(updated).forEach((prop, i) => {
      let parsedProp = parseInt(updated[prop])
      //  Non-castable values become NaN. Convert those cases to 0.
      if (isNaN(parsedProp)) parsedProp = 0
      updated[prop] = parsedProp
    })
    return updated
  }
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

export default SimpleNumber
