import React from 'react'
// import { Link, browserHistory } from 'react-router'

import Helmet from 'react-helmet'

import { Layout } from 'antd'
const { Header: AntHeader } = Layout
// import uwPatch from './Header.svg';
import w from '../../../images/w.svg';
import uw from '../../../images/uw.svg';
// import letter from './Letter.svg';
// import logo from './Logo.svg';
const Header = () => (
  <AntHeader>
    <div height='60' width='200'>
    {w}
    <img src={uw} />
    </div>
    UW & STF Header here.
  </AntHeader>
)
export default Header
