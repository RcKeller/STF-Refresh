import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Link } from 'react-router'

import Helmet from 'react-helmet'
import favicon from '../../images/favicon.ico'
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
  { name: 'apple-mobile-web-app-title', content: 'UW STF' }
]
// Add to homescreen for Chrome on Android
const link = [{ rel: 'icon', href: favicon }]

import { LocaleProvider, Layout, Icon, Breadcrumb } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
const { Sider, Header, Content } = Layout

// import Header from './Header/Header'
import Login from './Login/Login'
import Nav from './Nav/Nav'

import coreStyles from '../../css/main'
import styles from './Template.css'
import stf from '../../images/logoname.png'

/*
https://ant.design/components/breadcrumb/#components-breadcrumb-demo-router
Modified so that undefined links to home (glitch?)
*/
function breadcrumbRenderFix (route, params, routes, paths) {
  const last = routes.indexOf(route) === routes.length - 1
  const path = paths.join('/')
  return last
    ? <span>{route.breadcrumbName}</span>
    : <Link to={path || '/'}>{route.breadcrumbName}</Link>
}

@connect(state => ({
  // user: state.user
  screen: state.screen
}))
class Template extends React.Component {
  constructor (props) {
    super(props)
    this.state = { collapsed: true }
  }
  componentDidMount () {
    if (this.props.screen.greaterThan.medium) {
      this.toggle()
    }
  }
  componentWillReceiveProps
  toggle = () => { this.setState({ collapsed: !this.state.collapsed }) }
  render ({ children, router, routes, user, screen } = this.props) {
    // React-router is separated from redux store - too heavy to persist.
    return (
      <LocaleProvider locale={enUS}>
        <Layout className={styles['template']}>
          <Helmet
            title='UW Student Tech Fee'
            titleTemplate='%s - Student Tech Fee'
            meta={meta} link={link}
          />
          <Sider trigger={null}
            collapsible collapsed={this.state.collapsed}
            breakpoint='md'
            width={240} collapsedWidth='0'
          >
            <Login router={router} />
            <Nav router={router} />
          </Sider>
          <Layout className={styles['body']}>
            <Header>
              <Icon className='trigger' style={{fontSize: 32, lineHeight: 'inherit', color: 'white'}}
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
              <Link to='/'>
                <img src={stf} height={50} className={styles['logo']} />
              </Link>
            </Header>
            <Content>
              {routes[1].path &&
                <Breadcrumb
                  className={styles['breadcrumb']}
                  routes={routes} itemRender={breadcrumbRenderFix}
                />
              }
              {children}
            </Content>
          </Layout>
        </Layout>
      </LocaleProvider>
    )
  }
}
Template.propTypes = {
  children: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired,
  screen: PropTypes.object,
  user: PropTypes.object  // Async
}
export default Template
