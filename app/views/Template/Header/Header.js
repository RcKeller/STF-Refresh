import React from 'react'
import Toggler from './Toggler'
import Logo from './Logo'
import Login from './Login'

class Header extends React.Component {
  render () {
    return (
      <div className='app-header-inner'>
        <Toggler />
        <Logo />
        <Login />
      </div>
    )
  }
}

export default Header
