import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Helmet from 'react-helmet'

/*
Locale Information:
Antd is actually a chinese library by AliBaba, the chinese equiv. of Amazon
Locale Provider cascades context down to components, providing
english messages for things like 'No Data' in tables
*/
import { Link } from 'react-router'

import enUS from 'antd/lib/locale-provider/en_US'
import { LocaleProvider, Menu, Row, Col, Icon, Button, Popover } from 'antd'
const { Item } = Menu

const LOGO_URL = 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'

import favicon from '../../images/favicon.ico'
import mobileLogo from '../../images/mobileLogo.png'
import desktopLogo from '../../images/desktopLogo.png'
import WordmarkWhite from '../../images/WordmarkWhite.png'
// Metadata for SEO - don't change this much!
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

// import Login from './Login/Login'

/*
TEMPLATE:
The core UI for the website
Keeps track of many things like page nav, admin status, etc
Views adjust as necessary
*/
import '../../css/main'
import styles from './Template.css'
@connect(state => ({
  // Using redux-responsive for JS based media queries
  screen: state.screen,
  //  Nextlocation is the route of new pages router is transitioning to.
  nextLocation: state.routing.locationBeforeTransitions
    ? state.routing.locationBeforeTransitions.pathname
    : '1',
  links: state.config.links,
  stf: (state.user && state.user.stf) || {}
}))
class Template extends React.Component {
  static propTypes = {
    // children: PropTypes.object.isRequired,
    screen: PropTypes.object,
    router: PropTypes.object,
    nextLocation: PropTypes.string
  }
  static defaultProps = {
    children: null,
    screen: {},
    router: {},
    nextLocation: '/'
  }
  state = {
    menuVisible: false,
    menuMode: 'horizontal'
  }
  componentDidMount () {
    const { screen } = this.props
    // this.context.router.listen(this.handleHideMenu)
    this.setState({ menuMode: screen.lessThan.medium ? 'inline' : 'horizontal' })
  }

  handleHideMenu = () => {
    this.setState({ menuVisible: false })
  }

  handleShowMenu = () => {
    this.setState({ menuVisible: true })
  }

  onMenuVisibleChange = (visible) => {
    this.setState({ menuVisible: visible })
  }

  render (
    { children, screen, nextLocation, router, stf, links, location } = this.props,
    { menuMode, menuVisible } = this.state
  ) {

    const logo = screen.lessThan.medium ? mobileLogo : desktopLogo

    const menu = (
      <Menu mode={menuMode} id='nav' key='nav'>
        <Item key='home'>
          <Link to={'/'}>
            app.header.menu.home
          </Link>
        </Item>
        <Item key='docs'>
          <Link to={'/docs/getting-started'}>
            app.header.menu.docs
          </Link>
        </Item>
        <Item key='components'>
          <Link to={'/components/AvatarList'}>
            app.header.menu.components
          </Link>
        </Item>
      </Menu>
    )

    // React-router is separated from redux store - too heavy to persist.
    return (
      <LocaleProvider locale={enUS}>
        <div>
          <Helmet
            titleTemplate='%s - UW Student Tech'
            meta={meta} link={link}
          />
          <div id='header' className='header' style={{ backgroundColor: 'black' }}>
            {menuMode === 'inline' ? (
              <Popover
                overlayClassName='popover-menu'
                placement='bottomRight'
                content={menu}
                trigger='click'
                visible={menuVisible}
                arrowPointAtCenter
                onVisibleChange={this.onMenuVisibleChange}
              >
                <Icon
                  className='nav-phone-icon'
                  type='menu'
                  onClick={this.handleShowMenu}
                />
              </Popover>
            ) : null}
            <Row>
              <Col xxl={4} xl={5} lg={8} md={8} sm={24} xs={24}>
                <Link id='logo' to='/'>
                  <img src={logo} alt='logo' className={styles['stf-logo']} />
                </Link>
              </Col>
              <Col xxl={20} xl={19} lg={16} md={16} sm={0} xs={0}>
                <div id='search-box'>
                  <Icon type='search' />
                  <div>SelectBox</div>
                </div>
                <div className='header-meta'>
                  <div id='preview'>
                    <a
                      id='preview-button'
                      target='_blank'
                      href='http://preview.pro.ant.design'
                      rel='noopener noreferrer'
                    >
                      <Button icon='eye-o'>
                        app.home.preview
                      </Button>
                    </a>
                  </div>
                  {menuMode === 'horizontal' ? <div id='menu'>{menu}</div> : null}
                </div>
              </Col>
            </Row>
          </div>
          <div className={styles['body']}>
            {children}
          </div>
        </div>
      </LocaleProvider>
    )
  }
}

export default Template
