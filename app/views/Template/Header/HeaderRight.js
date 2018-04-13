import React from 'react'
import { Menu, Icon } from 'antd'
const SubMenu = Menu.SubMenu

class NavRight extends React.Component {
  render () {
    return (
      <Menu mode='horizontal'>
        <SubMenu title={<span><Icon type='user' />UserName</span>}>
          <Menu.Item key='profile:2'><a href='#/app/page/about'>About</a></Menu.Item>
          <Menu.Item key='profile:1'><a href='#/login'>Logout</a></Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}
export default NavRight
