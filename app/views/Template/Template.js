import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../services'

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

import enUS from 'antd/lib/locale-provider/en_US'
import { LocaleProvider, Spin, Layout, Icon } from 'antd'
const { Header } = Layout
import Drawer from 'rc-drawer'

// import Header from './Header/Header'
import Login from './Login/Login'
import Nav from './Nav/Nav'

import '../../css/main'
import styles from './Template.css'

import mobileLogo from '../../images/mobileLogo.png'
import desktopLogo from '../../images/desktopLogo.png'

import WordmarkWhite from '../../images/WordmarkWhite.png'

// @compose(
//   connect(state => ({ screen: state.screen })),
//   connectRequest(() => api.get('config'))
// )
@connect(state => ({ screen: state.screen }))
class Template extends React.Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    screen: PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = { open: false }
  }
  handleToggle = () => this.setState({ open: !this.state.open })
  render (
    { children, screen } = this.props,
    { open } = this.state
  ) {
    // React-router is separated from redux store - too heavy to persist.
    return (
      <LocaleProvider locale={enUS}>
        <div>
          <Helmet
            // title='Home'
            titleTemplate='%s - UW Student Tech'
            meta={meta} link={link}
          />
          <Header>
            {screen.lessThan.large
              ? <Icon
                style={{fontSize: 32, lineHeight: 'inherit', color: 'white', marginRight: 16}}
                type={this.state.open ? 'menu-unfold' : 'menu-fold'}
                onClick={this.handleToggle}
              />
              : <a href='http://www.washington.edu/'>
                <img src={WordmarkWhite} className={styles['uw-logo']} />
              </a>
            }
            <Link to='/'>
              <img src={screen.lessThan.medium ? mobileLogo : desktopLogo} className={styles['stf-logo']} />
            </Link>
            <Login />
          </Header>
          <Drawer
            position={screen.greaterThan.medium ? 'top' : 'left'}
            docked={screen.greaterThan.medium}
            open={!screen.greaterThan.medium && open}
            transitions
            touch
            onOpenChange={this.handleToggle}
            enableDragHandle={false}
            dragToggleDistance={30}
            sidebar={<Nav />}
            sidebarStyle={screen.lessThan.large ? { overflowY: 'auto' } : {}}
           >
            <div className={styles['body']}>
              {children || <Spin size='large' tip='Loading Page...' />}
            </div>
          </Drawer>
        </div>
      </LocaleProvider>
    )
  }
}

export default Template
