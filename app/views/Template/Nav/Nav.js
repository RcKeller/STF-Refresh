import React from 'react'

import { Menu, Icon, Alert } from 'antd'
const SubMenu = Menu.SubMenu
// const ItemGroup = Menu.ItemGroup
const Item = Menu.Item

const keyserver = 'http://itconnect.uw.edu/wares/acquiring-software-and-hardware/keyserver-help-for-it-staff/'

import styles from './Nav.css'
class Nav extends React.Component {
  render ({ router } = this.props) {
    return (
      <Menu mode='inline'
        defaultSelectedKeys={['1']}
        selectedKeys={[router.location.pathname]}
        onClick={(i) => i.key && router.push(i.key)}
      >
        <Item key='/proposals'>
          <Icon type='solution' /><span className='nav-text'>Proposals</span>
        </Item>
        <Item key='/blocks'>
          <Icon type='desktop' /><span className='nav-text'>Block Funding</span>
        </Item>

        <Item key='/faq'>
          <Icon type='question-circle-o' /><span className='nav-text'>F.A.Q.</span>
        </Item>
        <Item key='/about'>
          <Icon type='info-circle-o' /><span className='nav-text'>About</span>
        </Item>
        <Item key='/contact'>
          <Icon type='team' /><span className='nav-text'>Contact Us</span>
        </Item>
        <Item key='/calendar'>
          <Icon type='calendar' /><span className='nav-text'>Calendar</span>
        </Item>
        <SubMenu key='sub1' title={<span><Icon type='file' /><span>Documents</span></span>}>
          <Item key='/documents'>Commitee Docs</Item>
          <Item key='/docs/Current Request for Proposals.pdf' >Request for Proposals</Item>
          <Item key=''>
            <a href={keyserver} target='_blank'>License Keyserver</a>
          </Item>
        </SubMenu>
        <Alert type='info' banner showIcon
          className={styles['event']}
          message='Meetings'
          description={<span>Every Monday<br />3:30 - 5:30PM<br />HUB 305</span>}
        />
      </Menu>
    )
  }
}
export default Nav
