import React from 'react'
import ReactQuill from 'react-quill'

import styles from './Update.css'
// require('./Update.css')
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import theme from 'react-quill/dist/quill.snow.css'
import './quill.core.css'
class Update extends React.Component {
  constructor (props) {
    super(props)
    this.state = { text: '' }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (value) {
    this.setState({ text: value })
  }

  render () {
    return (
      <ReactQuill theme='snow' value={this.state.text}
        onChange={this.handleChange} />
    )
  }
}
export default Update
