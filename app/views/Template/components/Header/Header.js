import React from 'react'
// import { Link, browserHistory } from 'react-router'

import Helmet from 'react-helmet'

import { Layout } from 'antd'
// Nav === Sider from antd docs (horrid namespace)
const { Header: AntHeader } = Layout

const Header = () => (
  <AntHeader>
    UW & STF Header here.
  </AntHeader>
)
export default Header
