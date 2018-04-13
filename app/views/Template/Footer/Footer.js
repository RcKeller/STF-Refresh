import React from 'react'

class Footer extends React.Component {
  render () {
    return (
      <div className='app-footer-inner'>
        <span className='footer-left'>
          <span>Copyright © <a className='brand' target='_blank' href='/'>UWSTF</a> YEAR HERE</span>
        </span>
        <span className='footer-right'>
          <span>Built with Love <i className='anticon anticon-heart' /></span>
        </span>
      </div>
    )
  }
}

module.exports = Footer
