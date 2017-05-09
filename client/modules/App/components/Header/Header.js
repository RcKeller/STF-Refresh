import React, { PropTypes } from 'react'

// Import Style
// import styles from './Header.css'
import styles from '../uw.css'

export function Header (props, context) {
  return (
    <div id={styles['uw-container']}>
      <div id={styles['uw-container-inner']}>
        <header className={styles['uw-thinstrip']}>
          <nav className={styles['uw-thin-strip-nav']}>
            <ul className={styles['uw-thin-links']}>
              <li>
                <a href='http://myuw.washington.edu' title='MyUW'>MyUW</a>
              </li>

              <li>
                <a href='http://uw.edu/calendar' title='UW Calendar'>Calendar</a>
              </li>

              <li>
                <a href='http://uw.edu/maps' title='UW Maps'>Maps</a>
              </li>

              <li>
                <a href='http://uw.edu/directory' title='UW Directories'>Directories</a>
              </li>
            </ul>
          </nav>

          <div className={styles['container']}>
            <a className={styles['uw-patch']} href='http://uw.edu' tabindex='-1' title='University of Washington Home'>Home</a> <a className={styles['uw-wordmark']}
              href='http://uw.edu' title='University of Washington Home'>Home</a>
          </div>
        </header>

      </div>
    </div>
    // <div className={styles.header}>
    //   <div className={styles.content}>
    //     <h1 className={styles['site-title']} />
    //     {
    //       context.router.isActive('/', true)
    //         ? <a className={styles['add-post-button']} href='#' onClick={props.toggleAddPost}>Add a Post!</a>
    //         : null
    //     }
    //   </div>
    // </div>
  )
}

Header.contextTypes = {
  router: React.PropTypes.object
}
Header.propTypes = {
  toggleAddPost: PropTypes.func.isRequired
}

export default Header
