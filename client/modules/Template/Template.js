import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

// Import Meta Components
import DevTools from '../../DevTools'
import Helmet from 'react-helmet'
const meta = [
  { charset: 'utf-8' },
  { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1' }
]

// UI Components
import { Layout, Menu, Icon } from 'antd'
const { Content, Sider } = Layout
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

import UWHeader from './components/UWHeader/UWHeader'

import styles from './Template.css'
export class Template extends React.Component {
  constructor (props) {
    super(props)
    this.state = { mounted: false, selected: '/' }
    this.highlightMenuItem = this.highlightMenuItem.bind(this)
  }
  componentDidMount () {
    this.setState({ mounted: true })
    this.highlightMenuItem()
  }
  componentWillReceiveProps () { this.highlightMenuItem() }
  highlightMenuItem () { this.setState({selected: window.location.pathname}) }
  render () {
    return (
      <Layout>
        {this.state.mounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
        <Helmet meta={meta}
          title='UW Student Tech Fee Commitee'
          titleTemplate='%s - Student Tech Fee'
        />
        <UWHeader />
        <Layout style={{ height: 'calc(100vh - 58px)' }}>
          <Sider breakpoint='md' width={240} collapsedWidth='0' style={{zIndex: 999, background: '#FFF'}}>
            <div className={styles['logo']} onClick={() => browserHistory.push('/')} />
            <Menu mode='inline'
              defaultSelectedKeys={['1']}
              selectedKeys={[this.state.selected]}
              onClick={(i) => i.key && browserHistory.push(i.key)}
            >
              <SubMenu key='sub1' title={<span><Icon type='solution' /><span>Proposals</span></span>}>
                <MenuItemGroup key='g1' title='Browse'>
                  <Menu.Item key='/proposals/browse'>All Proposals</Menu.Item>
                  <Menu.Item key='/proposals/myproposals'>My Proposals</Menu.Item>
                  <Menu.Item key='/blocks'>Funding Blocks</Menu.Item>
                </MenuItemGroup>
                <MenuItemGroup key='g2' title='Submit'>
                  <Menu.Item key='/proposals/splash'>Proposal</Menu.Item>
                </MenuItemGroup>
              </SubMenu>
              <SubMenu key='sub2' title={<span><Icon type='file' /><span>Documents</span></span>}>
                <Menu.Item key='/documents'>Commitee Docs</Menu.Item>
                <Menu.Item key='/docs/Current Request for Proposals.pdf' >Request for Proposals</Menu.Item>
                <Menu.Item key=''>
                  <a href='http://itconnect.uw.edu/wares/acquiring-software-and-hardware/keyserver-help-for-it-staff/' target='_blank'>
                    License Keyserver
                  </a>
                </Menu.Item>
              </SubMenu>
              <SubMenu key='sub3' title={<span><Icon type='team' /><span>About</span></span>}>
                <Menu.Item key='/about'>The Committee</Menu.Item>
                <Menu.Item key='/contact'>Contact Us</Menu.Item>
              </SubMenu>
              <Menu.Item key='/faq'>
                <Icon type='question' /><span className='nav-text'>FAQ</span>
              </Menu.Item>
              <SubMenu key='sub4' title={<span><Icon type='calendar' /><span>Calendar</span></span>}>
                <Menu.Item key='/calendar'>Schedule</Menu.Item>
                <Menu.Item key='/posts'>Upcoming Events</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Content>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    )
  }
}

Template.propTypes = { children: PropTypes.object.isRequired }
Template.contextTypes = { router: React.PropTypes.object }
function mapStateToProps (store) { return {} }
export default connect(mapStateToProps)(Template)
