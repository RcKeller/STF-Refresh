import React from 'react'
import { Layout, Icon } from 'antd'
const { Sider } = Layout
import { Link } from 'react-router'

import AppMenu from './Menu'

class AppSider extends React.Component {
  render () {
    const collapsed = false
    return (
      <Sider
        collapsible
        collapsed={collapsed}
        collapsedWidth={0}
        trigger={null}
        width={180}
        className='app-sidebar'
      >
        <section className='sidebar-header'>
          <span>LOGO</span>
          <a href='/' className='brand'>UWSTF</a>
        </section>
        <div className='sidebar-content' ref='sidebarContent'>
          <AppMenu />
        </div>
        <div className='sidebar-footer'>
          <Link to='/faq'>
            <Icon type='question-circle' />
            <span className='nav-text'><span>Help</span> & <span>Support</span></span>
          </Link>
        </div>
      </Sider>
    )
  }
}

export default AppSider
