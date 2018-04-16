import React from 'react'
import HeaderLeft from './HeaderLeft'
import HeaderRight from './HeaderRight'

class Header extends React.Component {
  render () {
    return (
      <div className='app-header-inner'>
        <HeaderLeft />
        <HeaderRight />
      </div>
    )
  }
}

export default Header
