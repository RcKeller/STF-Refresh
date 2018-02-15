import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Helmet from 'react-helmet'
// NOTE: Antd is based on rc-components, fyi
import Drawer from 'rc-drawer'
//
/*
Locale Information:
Antd is actually a chinese library by AliBaba, the chinese equiv. of Amazon
Locale Provider cascades context down to components, providing
english messages for things like "No Data" in tables
*/
import { Link } from 'react-router'

import enUS from 'antd/lib/locale-provider/en_US'
import { LocaleProvider, Spin, Layout, Icon, Menu } from 'antd'
const { Header } = Layout
const SubMenu = Menu.SubMenu
const Item = Menu.Item
const ItemGroup = Menu.ItemGroup

//  Importing images for usage in styling (made possible by webpack loaders)
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

import Login from './Login/Login'

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
  year: state.config.year,
  stf: (state.user && state.user.stf) || {}
}))
class Template extends React.Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    screen: PropTypes.object,
    router: PropTypes.object,
    nextLocation: PropTypes.string
  }
  constructor (props) {
    super(props)
    this.state = { open: false }
  }
  //  Toggle menu view
  handleToggle = () => this.setState({ open: !this.state.open })
  //  Changed pages? Close the nav
  componentWillReceiveProps (nextProps) {
    if (this.state.open) {
      if (this.props.nextLocation !== nextProps.nextLocation) {
        this.setState({ open: false })
      }
    }
  }
  render (
    { children, screen, nextLocation, router, stf, links, year } = this.props,
    { open } = this.state
  ) {
    // React-router is separated from redux store - too heavy to persist.
    return (
      <LocaleProvider locale={enUS}>
        <div>
          <Helmet
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
            sidebarStyle={screen.lessThan.large
              ? { overflowY: 'auto', overflowX: 'hidden' } : {}
            }
            sidebar={
              <Menu
                theme='dark'
                mode={screen.lessThan.large ? 'inline' : 'horizontal'}
                selectedKeys={[nextLocation]}
                // onClick={this.handleNavigate}
                onClick={({ key }) => key.startsWith('/') && router.push(key)}
              >
                <Item key='/proposals'>
                  <Icon type='solution' /><span className='nav-text'>Proposals</span>
                </Item>
                <Item key='/blocks'>
                  <Icon type='desktop' /><span className='nav-text'>Block Funding</span>
                </Item>
                <Item key='/members'>
                  <Icon type='team' /><span className='nav-text'>Members</span>
                </Item>
                <Item key='/faq'>
                  <Icon type='question' /><span className='nav-text'>F.A.Q.</span>
                </Item>
                <Item key='/contact'>
                  <Icon type='info' /><span className='nav-text'>Contact Us</span>
                </Item>
                <SubMenu key='sub2' title={<span><Icon type='folder-open' /><span>Documents</span></span>}>
                  <Item key='rfp'>
                    <a href={links.rfp} target='_blank'>Request For Proposals</a>
                  </Item>
                  <Item key='drive'>
                    <a href={links.drive} target='_blank'>Committee Docs</a>
                  </Item>
                  <Item key='keyserver'>
                    <a href={links.keyserver} target='_blank'>License Keyserver</a>
                  </Item>
                </SubMenu>
                {Object.keys(stf).length > 0 && // if associated in any way with STF
                  <SubMenu key='sub1' title={<span><Icon type='safety' /><span>Committee</span></span>}>
                    <Item key='/dashboard'>
                      <Icon type='area-chart' /><span className='nav-text'>Dashboard</span>
                    </Item>
                    <Item key='/voting'>
                      <Icon type='check-circle-o' /><span className='nav-text'>Voting</span>
                    </Item>
                    {stf.admin &&
                      <ItemGroup key='g1' title='Admin Tools'>
                        <Item key={`/docket/${year}`}>
                          <Icon type='schedule' /><span className='nav-text'>Docket</span>
                        </Item>
                        <Item key='/config'>
                          <Icon type='tool' /><span className='nav-text'>Site Config</span>
                        </Item>
                      </ItemGroup>
                    }
                  </SubMenu>
                }
              </Menu>
            }
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
