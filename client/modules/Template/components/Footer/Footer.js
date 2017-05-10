import React from 'react'
// import PropTypes from 'prop-types'

// Import Style
import styles from '../uw.css'

export function Footer () {
  return (
    <div id={styles['uw-container']}>
      <div id={styles['uw-container-inner']}>
        <footer className={styles['uw-thinstrip']}>
          <ul className={styles['uw-thin-links']}>
            <li> <a href='https://uwstf.org/about' title='About Us'>About Us</a></li>
            <li><a href='https://uwstf.org/faq' title='FAQ'>FAQ</a></li>
            <li><a href='https://uwstf.org/contact' title='Contact Us'>Contact Us</a></li>
            <li><a>Student Tech Fee ©</a></li>
          </ul>
        </footer>
      </div>
    </div>
  )
}

export default Footer
