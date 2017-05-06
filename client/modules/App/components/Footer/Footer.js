import React from 'react'

// Import Style
import styles from './Footer.css'

// Import Images
import bg from '../../header-bk.png'

export function Footer () {
  return (
    <div style={{ background: `#FFF url(${bg}) center` }} className={styles.footer}>
      TEST
      <p>&copy; 2016 &middot; Hashnode &middot; LinearBytes Inc.</p>
      <p><div className='formatted-message' id='twitterMessage' /> : <a href='https://twitter.com/@mern_io' target='_Blank'>@mern_io</a></p>
    </div>
  )
}

export default Footer
