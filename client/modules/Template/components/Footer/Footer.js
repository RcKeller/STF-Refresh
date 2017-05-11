import React from 'react'
// import PropTypes from 'prop-types'
import { Link } from 'react-router'

// Import Style
import styles from '../uw.css'

export function Footer () {
  return (
    <div id={styles['uw-container']}>
      <div id={styles['uw-container-inner']}>
        <footer className={styles['uw-thinstrip']}>
          <ul className={styles['uw-thin-links']}>
            <li><Link to='/about/'>About</Link></li>
            <li><Link to='/faq/'>FAQ</Link></li>
            <li><Link to='/contact/'>Contact</Link></li>
            <li><a>Student Tech Fee ©</a></li>
          </ul>
        </footer>
      </div>
    </div>
  )
}

export default Footer
