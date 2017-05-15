import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

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
    this.state = { mounted: false }
  }
  componentDidMount () { this.setState({mounted: true}) }
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
            <div className={styles['logo']} />
            <Menu mode='inline'>
              <SubMenu key='sub1' title={<span><Icon type='solution' /><span>Proposals</span></span>}>
                <MenuItemGroup key='g1' title='Browse'>
                  <Menu.Item key='1'>All Proposals</Menu.Item>
                  <Menu.Item key='2'>My Proposals</Menu.Item>
                  <Menu.Item key='3'>Funding Blocks</Menu.Item>
                </MenuItemGroup>
                <MenuItemGroup key='g2' title='Submit'>
                  <Menu.Item key='4'>Proposal</Menu.Item>
                  <Menu.Item key='5'>Block</Menu.Item>
                </MenuItemGroup>
              </SubMenu>
              <SubMenu key='sub2' title={<span><Icon type='file' /><span>Documents</span></span>}>
                <Menu.Item key='6'>Commitee Docs</Menu.Item>
                <Menu.Item key='7'>Request for Proposals</Menu.Item>
                <Menu.Item key='8'>License Keyserver</Menu.Item>
              </SubMenu>
              <SubMenu key='sub3' title={<span><Icon type='team' /><span>About</span></span>}>
                <Menu.Item key='9'>The Committee</Menu.Item>
                <Menu.Item key='10'>Contact Us</Menu.Item>
              </SubMenu>
              <Menu.Item key='11'>
                <Icon type='question' /><span className='nav-text'>FAQ</span>
              </Menu.Item>
              <SubMenu key='sub4' title={<span><Icon type='calendar' /><span>Calendar</span></span>}>
                <Menu.Item key='12'>Schedule</Menu.Item>
                <Menu.Item key='13'>Upcoming Events</Menu.Item>
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
function mapStateToProps (store) { return {} }
export default connect(mapStateToProps)(Template)
