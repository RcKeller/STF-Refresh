import React, { PropTypes } from 'react'

// Import Style
import styles from './Header.css'

export function Header (props, context) {
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <h1 className={styles['site-title']} />
        {
          context.router.isActive('/', true)
            ? <a className={styles['add-post-button']} href='#' onClick={props.toggleAddPost}>Add a Post!</a>
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
  toggleAddPost: PropTypes.func.isRequired
}

export default Header
