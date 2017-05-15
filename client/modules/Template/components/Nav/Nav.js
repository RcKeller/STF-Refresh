import React from 'react'
// import { Link } from 'react-router'

import { Layout, Menu, Icon } from 'antd'
const { Sider } = Layout

import styles from './Nav.css'
export function Nav () {
  return (
    <Sider breakpoint='md' collapsedWidth='0' style={{zIndex: 999}}>
      <div className={styles['logo-spotlight']}>
        <div className={styles['logo']} />
      </div>
      <Menu theme='dark' mode='inline'>
        <Menu.Item key='1'>
          <Icon type='solution' />
          <span className='nav-text'>Proposals</span>
        </Menu.Item>
        <Menu.Item key='2'>
          <Icon type='file' />
          <span className='nav-text'>Documents</span>
        </Menu.Item>
        <Menu.Item key='4'>
          <Icon type='calendar' />
          <span className='nav-text'>Calendar</span>
        </Menu.Item>
        <Menu.Item key='3'>
          <Icon type='team' />
          <span className='nav-text'>About</span>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

export default Nav
