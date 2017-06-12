import React from 'react'
import { Link } from 'react-router'

import { Menu, Icon, Alert } from 'antd'
const SubMenu = Menu.SubMenu
const ItemGroup = Menu.ItemGroup
const Item = Menu.Item

import styles from './Nav.css'
const Nav = ({ router }) => (
  <Menu mode='inline' theme='dark'
    defaultSelectedKeys={['1']}
    selectedKeys={[router.location.pathname]}
    onClick={(i) => i.key && router.push(i.key)}
  >
    <SubMenu key='sub1' title={<span><Icon type='solution' /><span>Proposals</span></span>}>
      <ItemGroup key='g1' title='Browse'>
        <Item key='/proposals'>All Proposals</Item>
        <Item key='/proposals/myproposals'>My Proposals</Item>
        <Item key='/blocks'>Funding Blocks</Item>
      </ItemGroup>
      <ItemGroup key='g2' title='Submit'>
        <Item key='/proposals/create'>Proposal</Item>
      </ItemGroup>
    </SubMenu>
    <SubMenu key='sub2' title={<span><Icon type='file' /><span>Documents</span></span>}>
      <Item key='/documents'>Commitee Docs</Item>
      <Item key='/docs/Current Request for Proposals.pdf' >Request for Proposals</Item>
      <Item key=''>
        <a href='http://itconnect.uw.edu/wares/acquiring-software-and-hardware/keyserver-help-for-it-staff/' target='_blank'>
          License Keyserver
        </a>
      </Item>
    </SubMenu>
    <SubMenu key='sub3' title={<span><Icon type='team' /><span>About</span></span>}>
      <Item key='/about'>The Committee</Item>
      <Item key='/contact'>Contact Us</Item>
    </SubMenu>
    <Item key='/faq'>
      <Icon type='question' /><span className='nav-text'>FAQ</span>
    </Item>
    <SubMenu key='sub4' title={<span><Icon type='calendar' /><span>Calendar</span></span>}>
      <Item key='/calendar'>Schedule</Item>
      <Item key='/events'>Upcoming Events</Item>
    </SubMenu>
    <Alert type='info' banner showIcon
      className={styles['event']}
      message='Meetings'
      description={<span>Every Monday<br />3:30 - 5:30PM<br />HUB 305</span>}
    />
  </Menu>
)
export default Nav
