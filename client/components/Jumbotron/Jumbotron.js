import React from 'react'
import PropTypes from 'prop-types'

// Import Style
import styles from './Jumbotron.css'

export function Jumbotron (props) {
  return (
    <div className={styles['jumbotron']} style={{background: `url(${props.image})`}}>
      <div className='container'>
        <h1>{props.title}</h1>
      </div>
    </div>
  )
}
// backgroundPosition: 'center 40%',
// backgroundRepeat: 'no-repeat',
// backgroundSize: 'cover',
// background: `url(${props.image})`
// }}>

Jumbotron.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}
export default Jumbotron
