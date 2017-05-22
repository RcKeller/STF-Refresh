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
import { Layout, Menu, Icon, Alert } from 'antd'
const { Content, Sider } = Layout
const SubMenu = Menu.SubMenu
const ItemGroup = Menu.ItemGroup
const Item = Menu.Item

import UWHeader from './components/UWHeader/UWHeader'

// ANT UI Theme
// import '../../theme.less'
// Global (->main.css) and Template Styles
import styles from './Template.css'
// STF Logo
import STFLogo from './stf.png'

export class Template extends React.Component {
  constructor (props) {
    super(props)
    this.state = { mounted: false, selected: '/' }
    this.highlight = this.highlight.bind(this)
  }
  componentDidMount () {
    this.setState({ mounted: true })
    this.highlight()
  }
  componentWillReceiveProps () { this.highlight() }
  highlight () { this.setState({selected: window.location.pathname}) }
  render () {
    return (
      <Layout>
        {this.state.mounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
        <Helmet meta={meta}
          title='UW Student Tech Fee Commitee'
          titleTemplate='%s - Student Tech Fee'
        />
        <UWHeader />
        <Layout style={{ minHeight: 'calc(100vh - 58px)' }}>
          <Sider breakpoint='md' width={240} collapsedWidth='0' style={{zIndex: 999, background: '#FFF'}}>
            <div className={styles['logo']} style={{background: `url(${STFLogo})`}} onClick={() => browserHistory.push('/')} />
            <Menu mode='inline'
              defaultSelectedKeys={['1']}
              selectedKeys={[this.state.selected]}
              onClick={(i) => i.key && browserHistory.push(i.key)}
            >
              <SubMenu key='sub1' title={<span><Icon type='solution' /><span>Proposals</span></span>}>
                <ItemGroup key='g1' title='Browse'>
                  <Item key='/proposals/browse'>All Proposals</Item>
                  <Item key='/proposals/myproposals'>My Proposals</Item>
                  <Item key='/blocks'>Funding Blocks</Item>
                </ItemGroup>
                <ItemGroup key='g2' title='Submit'>
                  <Item key='/proposals/agreement'>Proposal</Item>
                </ItemGroup>
              </SubMenu>
              <SubMenu key='sub2' title={<span><Icon type='file' /><span>Documents</span></span>}>
                <Item key='/documents'>Commitee Docs</Item>
                <Item key='/docs/Current Request for Proposals.pdf' >Request for Proposals</Item>
                <Item key=''>
                  <a href='http://itconnect.uw.edu/wares/acquiring-software-and-hardware/keyserver-help-for-it-staff/' target='_blank'>
                    License Keyserver
                  </a>
                </Item>
              </SubMenu>
              <SubMenu key='sub3' title={<span><Icon type='team' /><span>About</span></span>}>
                <Item key='/about'>The Committee</Item>
                <Item key='/contact'>Contact Us</Item>
              </SubMenu>
              <Item key='/faq'>
                <Icon type='question' /><span className='nav-text'>FAQ</span>
              </Item>
              <SubMenu key='sub4' title={<span><Icon type='calendar' /><span>Calendar</span></span>}>
                <Item key='/calendar'>Schedule</Item>
                <Item key='/posts'>Upcoming Events</Item>
              </SubMenu>
              <Alert type='info' banner showIcon
                message='Meetings'
                description={<span>Every Monday<br />3:30 - 5:30PM<br />HUB 305</span>}
              />
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
