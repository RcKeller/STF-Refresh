import React from 'react'
import { Link } from 'react-router'

import Helmet from 'react-helmet'

import { Layout } from 'antd'
const { Header: AntHeader } = Layout

import stf from '../../../images/logoname.png'
import w from '../../../images/w.svg'

import styles from './Header.css'
const Header = () => (
  <AntHeader>
    <Link to='/'>
      {/* <img src={uw} height={50} width='50%'/> */}
      <img src={w} height={50} className={styles['w']} />
      <img src={stf} height={50} className={styles['stf']} />
    </Link>
  </AntHeader>
)
export default Header
