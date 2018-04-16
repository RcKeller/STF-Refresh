import React from 'react'
import { Icon } from 'antd'

class Toggler extends React.Component {
  // onToggleOffCanvasNav = () => {
    // const { handleToggleOffCanvasNav, offCanvasNav } = this.props;
    // handleToggleOffCanvasNav(!offCanvasNav);
  // }
  render () {
    // const { collapsedNav, offCanvasNav } = this.props;
    return (
      <div className='header-left'>
        <Icon
          className='header-icon app-sidebar-toggler'
          type='menu-unfold'
          // type={offCanvasNav ? 'right-square-o' : 'left-square-o'}
          // onClick={this.onToggleOffCanvasNav}
        />
      </div>
    )
  }
}

export default Toggler
