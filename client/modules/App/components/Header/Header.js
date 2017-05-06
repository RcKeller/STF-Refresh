import React, { PropTypes } from 'react'
import { Link } from 'react-router'

// Import Style
import styles from './Header.css'

export function Header (props, context) {

  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <h1 className={styles['site-title']}></h1>
        {
          context.router.isActive('/', true)
            ? <a className={styles['add-post-button']} href='#' onClick={props.toggleAddPost}><div className='formatted-message' id='addPost' /></a>
            : null
        }
      </div>
    </div>
  )
}

Header.contextTypes = {
  router: React.PropTypes.object
}

Header.propTypes = {
  toggleAddPost: PropTypes.func.isRequired,
  // switchLanguage: PropTypes.func.isRequired,
  // intl: PropTypes.object.isRequired
}

export default Header
