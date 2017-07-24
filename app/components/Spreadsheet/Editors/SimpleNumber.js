import React from 'react'
import PropTypes from 'prop-types'

import EditorBase from './EditorBase'

class SimpleNumber extends EditorBase {
  getValue () {
    let updated = super.getValue()
    //  Multiple values can be updated. Cast all of them to ints.
    Object.keys(updated).forEach((prop, i) => {
      let parsedProp = parseInt(updated[prop])
      if (isNaN(parsedProp)) parsedProp = 0
      updated[prop] = parsedProp
      //  Non-castable values become NaN. Convert those cases to 0.
      // !isNaN(parsedProp) ? updated[prop] = parsedProp : updated[prop] = 0
    })
    console.log('fixed', updated)
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
