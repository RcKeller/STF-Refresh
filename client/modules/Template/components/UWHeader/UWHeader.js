import React, { PropTypes } from 'react'

// Import Style
import styles from '../uw.css'

export function UWHeader () {
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
  )
}
UWHeader.contextTypes = {
  router: React.PropTypes.object
}

export default UWHeader
