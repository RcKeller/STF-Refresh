import React from 'react'
import { Link } from 'react-router'

import WordmarkWhite from '../../../images/WordmarkWhite.png'

class Logo extends React.Component {
  render () {
    return (
      <div className='header-center'>
        <Link to='/'>
          Image
          {/* <img src={WordmarkWhite} style={{
            verticalAlign: 'middle',
            maxHeight: 35,
            marginRight: 16
          }} /> */}
        </Link>
      </div>
    )
  }
}

export default Logo
