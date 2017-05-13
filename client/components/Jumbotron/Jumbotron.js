import React from 'react'
import PropTypes from 'prop-types'

import styles from './Jumbotron.css'
const Jumbotron = ({image, title}) => (
  <div className={styles['jumbotron']} style={{background: `url(${image})`}}>
    <div className='container'>
      <h1>{title}</h1>
    </div>
  </div>
)
Jumbotron.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}
Jumbotron.defaultProps = {
  image: 'https://uwstf.org/img/index.jpg',
  title: 'Student Technology Fee'
}

export default Jumbotron
