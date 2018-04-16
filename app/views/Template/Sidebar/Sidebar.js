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
        collapsedWidth={0}
        trigger={null}
        width={240}
        prefixCls='ant-layout-sider'
        className='app-sidebar'
        collapsed={collapsed}
      >
        <section className='sidebar-header'>
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
