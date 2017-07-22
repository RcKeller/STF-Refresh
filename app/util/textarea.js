import React from 'react'
import PropTypes from 'prop-types'
import editorWrapper from './editorWrapper'
import styles from './textarea.css'

import { Input } from 'antd'
const { TextArea } = Input

const TextAreaEditor = ({ editorValue, onValueChanged }) => {
  return (
    // <div className='editor-main editor-base'>
    <div className={styles['editor-main, editor-base']}>
      {/* <textarea
        className='text-area' value={editorValue}
        onChange={({ target: { value } }) => { onValueChanged(value) }} /> */}
      <TextArea rows={4}
        value={editorValue}
        onChange={e => console.log(e)}
      />
      {/* <textarea className='text-area' value={editorValue} onChange={({ target: { value } }) => { onValueChanged(value) }} /> */}
    </div>
  )
}

TextAreaEditor.propTypes = {
  editorValue: PropTypes.string.isRequired,
  onValueChanged: PropTypes.func.isRequired
}

export default editorWrapper(TextAreaEditor)
export { TextAreaEditor }
