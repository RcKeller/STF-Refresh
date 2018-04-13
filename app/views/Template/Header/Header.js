import React from 'react'
import HeaderLeft from './HeaderLeft'
import HeaderRight from './HeaderRight'

class Header extends React.Component {
  render () {
    return (
      <div
        className='app-header-inner'>
        <div className='header-left'>
          <HeaderLeft />
        </div>
        <div className='header-right'>
          <HeaderRight />
        </div>
      </div>
    )
  }
}

export default Header