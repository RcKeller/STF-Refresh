import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import DevTools from '../../DevTools'

// Import Components
import Helmet from 'react-helmet'

import { Layout, Menu, Icon } from 'antd'
const { Header, Content, Footer, Sider } = Layout
// const SubMenu = Menu.SubMenu;

// import Nav from './components/Nav/Nav'
import UWHeader from './components/UWHeader/UWHeader'
// import STFHeader from './components/STFHeader/STFHeader'
// import Footer from './components/Footer/Footer'

import styles from './Template.css'
const meta = [
  { charset: 'utf-8' },
  { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1' }
]
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
              <Menu.Item key='1'>
                <Icon type='solution' /><span className='nav-text'>Proposals</span>
              </Menu.Item>
              <Menu.Item key='2'>
                <Icon type='file' /><span className='nav-text'>Documents</span>
              </Menu.Item>
              <Menu.Item key='3'>
                <Icon type='team' /><span className='nav-text'>About</span>
              </Menu.Item>
              <Menu.Item key='4'>
                <Icon type='calendar' /><span className='nav-text'>Calendar</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content>
            {this.props.children}
            {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2016 Created by Ant UED</Footer> */}
          </Content>
        </Layout>
      </Layout>
    )
  }
}
/*
// Import Actions
import { toggleAddPost } from './TemplateActions'

<a className={styles['add-post-button']} href='#' onClick={() => this.props.dispatch(toggleAddPost())}>
  Debug Placeholder: Add a post!
</a>
// dispatch: PropTypes.func.isRequired
*/

Template.propTypes = { children: PropTypes.object.isRequired }
function mapStateToProps (store) { return {} }
export default connect(mapStateToProps)(Template)
