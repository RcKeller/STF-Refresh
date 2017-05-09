import React from 'react'

// Import Style
// import styles from './Footer.css'
import styles from '../uw.css'

// Import Images
import bg from '../../header-bk.png'

export function Footer () {
  return (
    <div id={styles['uw-container']}>
      <div id={styles['uw-container-inner']}>
        <footer className={styles['uw-thinstrip']}>
          <ul className={styles['uw-thin-links']}>
            <li>
              <a href='https://uwstf.org/about' title='About Us'>About Us</a>
            </li>

            <li>
              <a href='https://uwstf.org/faq' title='FAQ'>FAQ</a>
            </li>

            <li>
              <a href='https://uwstf.org/contact' title='Contact Us'>Contact Us</a>
            </li>

            <li>
              <a>Student Tech Fee ©</a>
            </li>
          </ul>

          <div className={styles['container']} />
        </footer>

      </div>
    </div>
    // <div style={{ background: `#FFF url(${bg}) center` }} className={styles.footer}>
    //   TEST
    //   <p>&copy; 2016 &middot; Hashnode &middot; LinearBytes Inc.</p>
    //   <p><div className='formatted-message' id='twitterMessage' /> : <a href='https://twitter.com/@mern_io' target='_Blank'>@mern_io</a></p>
    // </div>
  )
}

export default Footer
