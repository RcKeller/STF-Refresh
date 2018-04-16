import React from 'react'

class Footer extends React.Component {
  date = new Date().getFullYear()
  render (
    { date } = this
  ) {
    return (
      <div className='app-footer-inner'>
        <span className='footer-left'>
          © <a className='brand' target='_blank' href='//www.washington.edu/'>{date} University of Washington</a>
        </span>
        <span className='footer-right'>
          <a target='_blank' href='//github.com/RcKeller/STF-Refresh'>Open Source <i className='anticon anticon-heart' /></a>
        </span>
      </div>
    )
  }
}

export default Footer
