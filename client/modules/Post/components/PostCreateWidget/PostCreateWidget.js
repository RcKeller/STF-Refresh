import React, { Component, PropTypes } from 'react'
// import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

// Import Style
import styles from './PostCreateWidget.css'

export class PostCreateWidget extends Component {
  constructor (props) {
    super(props)
    this.addPost = () => {
      const nameRef = this.refs.name
      const titleRef = this.refs.title
      const contentRef = this.refs.content
      if (nameRef.value && titleRef.value && contentRef.value) {
        this.props.addPost(nameRef.value, titleRef.value, contentRef.value)
        nameRef.value = titleRef.value = contentRef.value = ''
      }
    }
  }

  render () {
    const cls = `${styles.form} ${(this.props.showAddPost ? styles.appear : '')}`
    return (
      <div className={cls}>
        <div className={styles['form-content']}>
          <h2 className={styles['form-title']}><div className='formatted-message' id='createNewPost' /></h2>
          <input placeholder='Name' className={styles['form-field']} ref='name' />
          <input placeholder='Title' className={styles['form-field']} ref='title' />
          <textarea placeholder='Tell us about your proposal...' className={styles['form-field']} ref='content' />
          <a className={styles['post-submit-button']} href='#' onClick={this.addPost}><div className='formatted-message' id='submit' />Submit!</a>
        </div>
      </div>
    )
  }
}

PostCreateWidget.propTypes = {
  addPost: PropTypes.func.isRequired,
  showAddPost: PropTypes.bool.isRequired
  // intl: intlShape.isRequired,
}

export default PostCreateWidget
