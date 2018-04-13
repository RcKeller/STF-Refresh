import React from 'react'
import { Icon } from 'antd'

class NavLeft extends React.Component {
  // onToggleOffCanvasNav = () => {
    // const { handleToggleOffCanvasNav, offCanvasNav } = this.props;
    // handleToggleOffCanvasNav(!offCanvasNav);
  // }
  render () {
    // const { collapsedNav, offCanvasNav } = this.props;
    return (
      <ul className='header-list list-unstyled list-inline'>
        <li className='list-inline-item'>
          <Icon
            className='header-icon app-sidebar-toggler'
            type='right-square-o'
            // type={offCanvasNav ? 'right-square-o' : 'left-square-o'}
            // onClick={this.onToggleOffCanvasNav}
          />
        </li>
      </ul>
    )
  }
}

export default NavLeft
