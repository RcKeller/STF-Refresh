import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Helmet from 'react-helmet'
// import { meta, link } from './helmet'

import { Link, browserHistory } from 'react-router'
import { Layout } from 'antd'
const { Content, Sider } = Layout

import Header from './Header/Header'
import Login from './Login/Login'
import Nav from './Nav/Nav'
import Body from './Body/Body'

import favicon from '../../images/favicon.ico';

const meta = [
    { charset: 'utf-8' },
    // Meta descriptions are commonly used on search engine result pages to
    // display preview snippets for a given page.
    { name: 'Student Tech Fee - UW', content: 'Driving change and enriching learning environments one project, one proposal at a time.' },
    // Setting IE=edge tells Internet Explorer to use the latest engine to
    //  render the page and execute Javascript
    { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    // Using the viewport tag allows you to control the width and scaling of
    // the browser's viewport:
    // - include width=device-width to match the screen's width in
    // device-independent pixels
    // - include initial-scale=1 to establish 1:1 relationship between css pixels
    // and device-independent pixels
    // - ensure your page is accessible by not disabling user scaling.
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    // Disable tap highlight on IE
    { name: 'msapplication-tap-highlight', content: 'no' },
    // Add to homescreen for Chrome on Android
    { name: 'mobile-web-app-capable', content: 'yes' },
    // Add to homescreen for Safari on IOS
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    { name: 'apple-mobile-web-app-title', content: 'UW STF' },
]
const link = [
    // Add to homescreen for Chrome on Android
    { rel: 'icon', href: favicon }
  ]


import styles from './Template.css'
class Template extends React.Component {
  render () {
    // React-router is separated from redux store - too heavy to persist.
    const { children, router, routes, user } = this.props
    return (
      <Layout className={styles['template']}>
        <Helmet
          title='UW Student Tech Fee'
          titleTemplate='%s - Student Tech Fee'
          meta={meta} link={link}
        />
        <Sider breakpoint='md'
          width={240} collapsedWidth='0'
          className={styles['nav']}>
          <Login router={router} />
          <Nav router={router} />
        </Sider>
        <Layout className={styles['body']}>
          <Header />
          <Content>
            <Body routes={routes} children={children} />
          </Content>
        </Layout>
      </Layout>
    )
  }
}
Template.propTypes = {
  children: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired,
  user: PropTypes.object  // Async
}
export default Template
