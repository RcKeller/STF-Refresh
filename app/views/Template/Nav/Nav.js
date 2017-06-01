import React from 'react'
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Link, browserHistory } from 'react-router'

import Helmet from 'react-helmet'

import { Menu, Icon, Button, Alert } from 'antd'
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
    <Alert type='info' banner showIcon
      className={styles['nav-event']}
      message='Meetings'
      description={<span>Every Monday<br />3:30 - 5:30PM<br />HUB 305</span>}
    />
    <SubMenu key='sub1' title={<span><Icon type='solution' /><span>Proposals</span></span>}>
      <ItemGroup key='g1' title='Browse'>
        <Item key='/proposals/browse'>All Proposals</Item>
        <Item key='/proposals/myproposals'>My Proposals</Item>
        <Item key='/blocks'>Funding Blocks</Item>
      </ItemGroup>
      <ItemGroup key='g2' title='Submit'>
        <Item key='/proposals/agreement'>Proposal</Item>
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
      <Item key='/posts'>Upcoming Events</Item>
    </SubMenu>
  </Menu>
)
export default Nav
//
// Template.propTypes = {
//   children: PropTypes.object.isRequired,
//   router: PropTypes.object.isRequired,
//   user: PropTypes.object
// };
// export default Template
