import React from 'react'
import { Layout, Icon } from 'antd'
const { Sider } = Layout

import AppMenu from './Menu'

class AppSider extends React.Component {
  render () {
    const offCanvasNav = false
    const collapsedNav = false
    const sidebarWidth = 200
    const collapsedWidth = offCanvasNav ? 0 : 64
    return (
      <Sider
        collapsible
        collapsed={collapsedNav || offCanvasNav}
        collapsedWidth={collapsedWidth}
        trigger={null}
        width={sidebarWidth}
        className='app-sidebar'
      >
        <section className='sidebar-header'>
          {/* <svg className='logo-img logo-react' viewBox='0 0 3925 3525' version='1.1' xmlns='http://www.w3.org/2000/svg'>
            <circle className='react-dot' stroke='none' cx='1960' cy='1760' r='355' />
            <g className='react-curve' strokeWidth='170' fill='none'>
              <ellipse cx='2575' cy='545' rx='715' ry='1875' transform='rotate(30)' />
              <ellipse cx='1760' cy='-1960' rx='715' ry='1875' transform='rotate(90)' />
              <ellipse cx='-815' cy='-2505' rx='715' ry='1875' transform='rotate(-210)' />
            </g>
          </svg> */}
          <span>LOGO</span>
          <a href='#/' className='brand'>UWSTF</a>
        </section>
        <div className='sidebar-content' ref='sidebarContent'>
          <AppMenu />
        </div>
        <div className='sidebar-footer'>
          <a target='_blank' href='/'>
            <Icon type='question-circle' />
            <span className='nav-text'><span>Help</span> & <span>Support</span></span>
          </a>
        </div>
      </Sider>
    )
  }
}

export default AppSider
